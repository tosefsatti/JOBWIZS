import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();

    // Safely access allJobs from the Redux store
    const allJobs = useSelector((store) => store.job?.allJobs) || [];

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
                <div className='md:grid md:grid-cols-3 gap-4 sm:grid sm:grid-cols-1 sm:mx-auto'>
                    {
                        allJobs.length === 0 ? (
                            <span>No Jobs Found</span>
                        ) : (
                            allJobs.map((job) => (
                                <Job key={job._id} job={job} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Browse;
