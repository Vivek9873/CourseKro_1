
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'

function useGetCreatorCourses() {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.user);
    const creatorCourse = async () => {
        try {
            const result = await axios.get(BASE_URL + "/api/course/getcreator", { withCredentials: true });
            console.log(result.data.data);
            dispatch(setCreatorCourseData(result.data.data));
            // toast.success(result.data.message)
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
        useEffect(() => {
            creatorCourse();
        }, [])
    )

}

export default useGetCreatorCourses