
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseId, getCourseLecture, getCreatorById, getCreatorCourse, getPublishedCourse, removeCourse, removeLecture } from "../controllers/course-controller.js";
import upload from "../middleware/multer.js";
import { searchWithAi } from "../controllers/search-controller.js";
const courseRouter = express.Router();


courseRouter.post("/create", authMiddleware, createCourse);
courseRouter.get("/getpublished", getPublishedCourse);
courseRouter.get("/getcreator", authMiddleware, getCreatorCourse);
courseRouter.post("/editcourse/:courseId", authMiddleware, upload.single("thumbnail"), editCourse);
courseRouter.get("/getcourse/:courseId", getCourseId);
courseRouter.post("/getcourse/:courseId", authMiddleware, getCourseId);
courseRouter.delete("/remove/:courseId", authMiddleware, removeCourse);


// for lectures
courseRouter.post("/createlecture/:courseId", authMiddleware, createLecture);
courseRouter.get("/courselecture/:courseId", authMiddleware, getCourseLecture);
courseRouter.post("/editlecture/:lectureId", authMiddleware, upload.single("videoUrl"), editLecture);
courseRouter.delete("/removelecture/:lectureId", authMiddleware, removeLecture);
courseRouter.post("/creator", authMiddleware, getCreatorById);


// for search 
courseRouter.post("/search", searchWithAi);


export default courseRouter;
