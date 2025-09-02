import axios from "axios"
import { useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../redux/userSlice"
import { toast } from "react-toastify"


export const useGetUser = () => {
    const dispatch = useDispatch();
    // const { user } = useSelector(store => store.user)
    // console.log(user)
    async function fetchUser() {
        try {
            const result = await axios.get(BASE_URL + "/api/user/getCurrentUser", { withCredentials: true });
            dispatch(setUser(result.data.data));

        }
        catch (e) {
            console.log(e);
            dispatch(setUser(null));
            toast.error(e.response.data.message);
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
}