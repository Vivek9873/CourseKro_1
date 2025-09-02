
import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { setReviewData } from '../redux/reviewSlice';

function useGetAllReviews() {
    const dispatch = useDispatch();
    useEffect(() => {
        const allReviews = async () => {
            try {
                const result = await axios.get(BASE_URL + "/api/review/getreview", { withCredentials: true });
                dispatch(setReviewData(result.data.data));
                console.log(result.data);

            }
            catch (e) {
                console.log(e);

            }
        }
        allReviews();
    }, [])
}

export default useGetAllReviews