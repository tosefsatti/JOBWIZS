import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from '../utils/datauri.js'
import cloudinary from '../utils/cloudinary.js'
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: 'Something is missing', success: false });
        }

        const file = req.file;
        let resumeText = '';
        let profilePhotoUrl = '';
        let resumeUrl = '';

        if (file && file.buffer) {
            const fileUri = getDataUri(file);
            // if it's a PDF, upload as RAW
            if (file.mimetype === 'application/pdf') {
                const cloudResponse = await cloudinary.uploader.upload(
                    fileUri.content,
                    { resource_type: 'raw' }
                );
                resumeUrl = cloudResponse.secure_url;

                // parse text out of the PDF
                const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
                const data = await pdfParse(file.buffer);
                resumeText = data.text;
            } else {
                // otherwise assume image for profile photo
                const cloudResponse = await cloudinary.uploader.upload(
                    fileUri.content,
                    { resource_type: 'image' }
                );
                profilePhotoUrl = cloudResponse.secure_url;
            }
        }

        // check for existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashed,
            role,
            profile: {
                profilePhoto: profilePhotoUrl || undefined,
                resume: resumeUrl,
                resumeOriginalName: file?.originalname,
                resumeText,
            },
        });

        return res.status(201).json({ message: 'Account created successfully', success: true });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Something is missing', success: false })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password.', success: false })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch || role !== user.role) {
            return res.status(400).json({ message: 'Incorrect credentials or role.', success: false })
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        const safeUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res
            .cookie('token', token, { maxAge: 86400000, httpOnly: true, sameSite: 'strict' })
            .status(200)
            .json({ message: `Welcome back ${user.fullname}`, user: safeUser, success: true })
    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ message: 'Server error', success: false })
    }
}

export const logout = (req, res) =>
    res.cookie('token', '', { maxAge: 0 }).status(200).json({ message: 'Logged out successfully.', success: true })




export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const userId = req.id; // from your auth middleware

        let resumeUrl;
        let profilePhotoUrl;

        if (file && file.buffer) {
            const fileUri = getDataUri(file);

            if (file.mimetype === 'application/pdf') {
                const cloudResponse = await cloudinary.uploader.upload(
                    fileUri.content,
                    {
                        resource_type: 'raw',
                        format: 'pdf',                                  // ← force .pdf
                        public_id: `resumes/${userId}/${Date.now()}`,   // optional path
                    }
                );
                resumeUrl = cloudResponse.secure_url;             // ← assign here, not with const
            } else {
                const cloudResponse = await cloudinary.uploader.upload(
                    fileUri.content,
                    { resource_type: 'image' }
                );
                profilePhotoUrl = cloudResponse.secure_url;
            }
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found.', success: false });
        }

        // Update basic fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(',').map(s => s.trim());

        // Update file URLs
        if (profilePhotoUrl) {
            user.profile.profilePhoto = profilePhotoUrl;
        }
        if (resumeUrl) {
            user.profile.resume = resumeUrl;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const safeUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res
            .status(200)
            .json({ message: 'Profile updated successfully.', user: safeUser, success: true });
    } catch (error) {
        console.error('UpdateProfile error:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

export const getOtherUser = async (req, res) => {
    try {
        const otherUser = await User.find({ _id: { $ne: req.id } }).select('-password')
        return res.status(200).json({ success: true, otherUser })
    } catch (err) {
        console.error('GetOtherUser error:', err)
        return res.status(500).json({ message: 'Server error', success: false })
    }
}