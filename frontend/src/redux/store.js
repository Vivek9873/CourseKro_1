import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import courseReducer from "./courseSlice"
import lectureReducer from "./lectureSlice"
import reviewReducer from "./reviewSlice"
const appStore = configureStore({
    reducer: {
        user: userReducer,
        course: courseReducer,
        lecture: lectureReducer,
        review: reviewReducer,

    }
})

export default appStore;