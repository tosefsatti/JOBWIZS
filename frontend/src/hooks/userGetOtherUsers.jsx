import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGetUser } from '@/redux/authSlice'
import axios from 'axios'

/**
 * Hook to fetch and return all other users (excluding the current one)
 */
const useGetOtherUsers = () => {
    const dispatch = useDispatch()
    // select the list of other users from redux state
    const others = useSelector(state => state.auth.getUser)

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true
                const response = await axios.get('http://localhost:8000/api/v1/user/')
                if (response.data.success) {
                    // dispatch to store fetched users
                    dispatch(setGetUser(response.data.otherUser))
                }
            } catch (error) {
                console.error('Failed to fetch other users:', error)
            }
        }
        fetchOtherUsers()
    }, [dispatch])

    return { others }
}

export default useGetOtherUsers
