import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const jobId = params.id

    // determine if already applied
    const initiallyApplied = singleJob?.applications?.some(app => app.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(initiallyApplied)

    // fetch job on mount / jobId change
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(
                        res.data.job.applications.some(app => app.applicant === user?._id)
                    )
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    // actual apply API call
    const applyJobHandler = async () => {
        try {
            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                { withCredentials: true }
            )
            if (res.data.success) {
                setIsApplied(true)
                // update redux for real-time UI
                const updatedJob = {
                    ...singleJob,
                    applications: [
                        ...singleJob.applications,
                        { applicant: user?._id }
                    ]
                }
                dispatch(setSingleJob(updatedJob))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Application failed')
        }
    }

    // new click handler
    const handleApplyClick = () => {
        if (!user) {
            toast.error('Please log in first')
            navigate('/login')
            return
        }
        if (!isApplied) {
            applyJobHandler()
        }
    }

    return (
        <div className='max-w-7xl mx-auto my-10 p-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge variant="ghost" className="text-blue-700 font-bold">
                            {singleJob?.postion} Positions
                        </Badge>
                        <Badge variant="ghost" className="text-[#F83002] font-bold">
                            {singleJob?.jobType}
                        </Badge>
                        <Badge variant="ghost" className="text-[#7209b7] font-bold">
                            {singleJob?.salary} LPA
                        </Badge>
                    </div>
                </div>
                <Button
                    onClick={handleApplyClick}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                        }`}
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>

            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>
                Job Description
            </h1>
            <div className='my-4 space-y-2'>
                <p>
                    <strong>Role:</strong>{' '}
                    <span className='text-gray-800'>{singleJob?.title}</span>
                </p>
                <p>
                    <strong>Location:</strong>{' '}
                    <span className='text-gray-800'>{singleJob?.location}</span>
                </p>
                <p>
                    <strong>Description:</strong>{' '}
                    <span className='text-gray-800'>{singleJob?.description}</span>
                </p>
                <p>
                    <strong>Experience:</strong>{' '}
                    <span className='text-gray-800'>{singleJob?.experience} yrs</span>
                </p>
                <p>
                    <strong>Salary:</strong>{' '}
                    <span className='text-gray-800'>{singleJob?.salary} LPA</span>
                </p>
                <p>
                    <strong>Total Applicants:</strong>{' '}
                    <span className='text-gray-800'>{singleJob?.applications?.length}</span>
                </p>
                <p>
                    <strong>Posted Date:</strong>{' '}
                    <span className='text-gray-800'>
                        {singleJob?.createdAt?.split('T')[0]}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default JobDescription
