
import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import User from "../models/user.js";

export const createCourse = async (req, res) => {
    try {
        console.log(req.userId)
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({
                message: "Title or Category is required!",
            })
        }
        const course = await Course.create({
            title, creater: req.userId, category
        })
        return res.status(201).json({
            message: "Course Created Successfully",
            data: course,
        })

    }
    catch (e) {
        return res.status(500).json({ message: `Create Course error is ${e}` })
    }
}


export const getPublishedCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures reviews");
        if (!courses) {
            return res.status(400).json({
                message: "No Course Exists!"
            })
        }
        return res.status(200).json({
            message: "Courses Found Successfully!",
            data: courses,
        })
    }
    catch (e) {
        return res.status(500).json({ message: `GetPublished Course error is ${e}` })

    }
}

export const getCreatorCourse = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        const course = await Course.find({ creater: userId });
        const course1 = await Course.find({});

        if (!course) {
            return res.status(400).json({ message: `Courses are not published by ${user.name}` });
        }
        console.log(course1)
        return res.status(200).json({ message: "Courses found successfully!", data: course })
    }
    catch (e) {
        return res.status(500).json({ message: `Creator Course error is ${e}` })

    }
}

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, subTitle, description, category, level, isPublished, price } = req.body;
        let thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path);
        }
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: `Courses doesn't exists!` });
        }
        const updateData = { title, subTitle, description, category, level, isPublished, price, thumbnail };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({ message: "Course Updated Successfully!", data: course })
    }
    catch (e) {
        return res.status(500).json({ message: `Edit Course error is ${e}` })

    }
}


export const getCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course doesn't exists!" });

        }

        return res.status(200).json({ message: "Course Found Successfully!", data: course });
    }
    catch (e) {
        return res.status(500).json({ message: `Course by id error is ${e}` })

    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course doesn't exists!" });

        }
        course = await Course.findByIdAndDelete(courseId, { new: true });
        return res.status(200).json({ message: "Course Deleted Successfully!" });
    }
    catch (e) {
        return res.status(500).json({ message: `Course deletion error is ${e}` })

    }
}



// For lecture
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;
        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture Title is required",
            })
        }

        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
        }
        await course.populate("lectures")
        await course.save();
        return res.status(201).json({
            lecture, course
        })
    }
    catch (e) {
        return res.status(500).json({ message: `Lecture creating error is ${e}` })

    }
}


export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course doesn't exists!" })
        }
        await course.populate("lectures")
        await course.save();
        return res.status(200).json(course);
    }
    catch (e) {
        return res.status(500).json({ message: `Get Course Lecture error is ${e}` })

    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const { isPreviewFree, lectureTitle } = req.body;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(400).json({ message: "Lecture doesn't exists!" })
        }
        let videoUrl;
        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = videoUrl;
        }
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;
        await lecture.save();
        res.status(200).json(lecture);

    }
    catch (e) {
        return res.status(500).json({ message: `Edit Lecture error is ${e}` })

    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(400).json({ message: "Lecture doesn't exists!" })

        }
        const course = await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } })
        console.log(course)

        return res.status(200).json({ message: "Lecture removed successfully" })

    }
    catch (e) {
        return res.status(500).json({ message: `Remove Lecture error is ${e}` })

    }
}

// get creator 

export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User doesn't exists" })

        }

        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).json({ message: `Failed to get Creator error is ${e}` })

    }
}
