import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((store) => store.auth)

    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: (user?.profile?.skills || []).join(','),
        file: null,
    })
    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0]
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('fullname', input.fullname)
        formData.append('email', input.email)
        formData.append('phoneNumber', input.phoneNumber)
        formData.append('bio', input.bio)
        formData.append('skills', input.skills)
        if (input.file) {
            formData.append('file', input.file)
        }

        try {
            setLoading(true)
            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            )

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error('UpdateProfile error:', error)
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            )
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onInteractOutside={() => setOpen(false)} >
            <DialogContent className="sm:max-w-[425px] bg-sky-100 z-50">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} >
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullname" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <Input
                                id="bio"
                                name="bio"
                                type="text"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="skills" className="text-right">
                                Skills
                            </Label>
                            <Input
                                id="skills"
                                name="skills"
                                type="text"
                                placeholder="comma-separated"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="resume" className="text-right">
                                Resume
                            </Label>
                            <Input
                                id="resume"
                                name="resume"
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full my-4" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                            ) : (
                                'Update'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog