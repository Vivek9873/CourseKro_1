import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

export default function useGetPublishedCourse() {
    const dispatch = useDispatch();
    const getCourseData = async () => {
        try {
            const result = await axios.get(BASE_URL + "/api/course/getpublished", { withCredentials: true });
            dispatch(setCourseData(result.data.data));
            console.log(result.data.data);
        }
        catch (e) {
            console.log(e);
        }
    }
    useEffect(() => { getCourseData() }, [])
}