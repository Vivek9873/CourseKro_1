import Course from "../models/course.js"
import Review from "../models/review.js";

export const createReview = async (req, res) => {
    try {
        const { rating, comment, courseId } = req.body;
        const userId = req.userId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course doesn't exists!" });
        }

        const alreadyReviewed = await Review.findOne({ course: courseId, user: userId })
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this course" });
        }

        const review = await Review.create({
            course: courseId, user: userId, rating, comment
        });

        course.reviews.push(review._id);
        await course.save();
        res.status(200).json({ message: "Review posted successfully", data: review });
    }
    catch (e) {
        return res.status(500).json({ message: "Create Review error is " + e.message });
    }
}


export const getReviews = async (req, res) => {
    try {
        const review = await Review.find({}).populate("user course").sort({ reviewedAt: -1 })
        res.status(200).json({ message: "Reviews fetched successfully", data: review });
    }
    catch (e) {
        return res.status(500).json({ message: "Get Review error is " + e.message });

    }
}