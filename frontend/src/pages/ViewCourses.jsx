import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaLock, FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";
import emptyImg from "../assets/empty.jpg";
import { FaPlayCircle } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "../component/Card";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function ViewCourses() {
  const navigate = useNavigate();
  const { courseData, selectedCourse } = useSelector((store) => store.course);
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [createrCourses, setCreaterCourses] = useState(null);
  const { user } = useSelector((store) => store.user);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCourseData = () => {
    const course = courseData.find((c) => c._id === courseId);
    if (course) {
      dispatch(setSelectedCourse(course));
    }
  };

  const handleCreator = async () => {
    if (selectedCourse?.creater) {
      try {
        const result = await axios.post(
          BASE_URL + "/api/course/creator",
          { userId: selectedCourse?.creater },
          { withCredentials: true }
        );
        console.log("creater ka data hai ", result.data);
        setCreatorData(result.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await axios.post(
        BASE_URL + "/api/order/razorpayorder",
        { userId, courseId },
        { withCredentials: true }
      );
      console.log(orderData);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "CourseKro",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          console.log("Razorpay Response", response);
          try {
            const verifyPayment = await axios.post(
              BASE_URL + "/api/order/verifypayment",
              { ...response, courseId, userId },
              { withCredentials: true }
            );
            console.log(verifyPayment);
            toast.success(verifyPayment.data.message);
            setIsEnrolled(true);
          } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const checkEnrollment = () => {
    const verify = user?.enrolledCourses.some(
      (c) =>
        (typeof c === "string" ? c : c._id).toString() === courseId?.toString()
    );
    if (verify) setIsEnrolled(true);
  };

  const handleReview = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/review/createreview",
        { rating, comment, courseId },
        { withCredentials: true }
      );
      console.log(result.data);
      setLoading(false);
      toast.success(result.data.message);
      setRating(0);
      setComment("");
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error(e.response.data.message);
      setRating(0);
      setComment("");
    }
  };

  const calculataeAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculataeAvgReview(selectedCourse?.reviews);

  useEffect(() => {
    handleCreator();
  }, [selectedCourse]);
  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData, courseId, user]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const fetchCourses = courseData.filter(
        (course) =>
          course.creater === creatorData._id && course._id !== courseId
      );
      setCreaterCourses(fetchCourses);
    }
  }, [creatorData, courseData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* top sectoin  */}
        <div className=" flex flex-col md:flex-row gap-6">
          {/* thumbnail  */}
          <div className=" w-full md:w-1/2 ">
            <FaArrowLeftLong
              onClick={() => navigate("/")}
              className=" text-black w-[22px] h-[22px] cursor-pointer"
            />
            {selectedCourse?.thumbnail ? (
              <img
                className="rounded-xl w-full object-cover "
                src={selectedCourse.thumbnail}
              />
            ) : (
              <img className="rounded-xl w-full object-cover" src={emptyImg} />
            )}
          </div>
          {/* courseInfo  */}
          <div className=" flex-1 space-y-2 mt-[20px]">
            <h2 className=" text-2xl font-bold ">{selectedCourse?.title}</h2>
            <p className=" text-gray-600 ">{selectedCourse?.subTitle}</p>

            <div className=" flex justify-between flex-col">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className=" flex items-center justify-start  gap-1 ">
                  <FaStar /> {avgRating}
                </span>
                <span className="text-gray-400 ">(1200 Reviews)</span>
              </div>

              <div>
                <span className=" text-xl font-semibold text-black">
                  {"₹" + selectedCourse?.price}
                </span>{" "}
                <span className="line-through text-sm text-gray-400 ">
                  ₹599
                </span>
              </div>

              <ul className=" text-sm text-gray-700 space-y-1 pt-2 ">
                <li>✔ 10+ hours of video content</li>
                <li>✔ Lifetime access to course materials</li>
              </ul>

              {!isEnrolled ? (
                <button
                  onClick={() => handleEnroll(user._id, courseId)}
                  className=" bg-black w-1/4 text-white px-6 py-2 rounded cursor-pointer hover:bg-gray-700 mt-3"
                >
                  Enroll Now
                </button>
              ) : (
                <button
                  onClick={() => navigate("/viewlecture/" + courseId)}
                  className=" bg-green-100 w-1/4 text-green-500 px-6 py-2 rounded cursor-pointer hover:bg-gray-700 mt-3"
                >
                  Watch Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 ">What You'll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700 ">
            Beginners, aspiring developers and professionals looking to upgrade
            skills.
          </p>
        </div>

        <div className=" flex flex-col md:flex-row gap-6 ">
          <div className=" bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className=" text-sm text-gray-500 mb-4 ">
              {selectedCourse?.lectures?.length} Lectures
            </p>
            <div className=" flex flex-col gap-3 ">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  disabled={!lecture.isPreviewFree}
                  onClick={() =>
                    lecture.isPreviewFree
                      ? setSelectedLecture(lecture)
                      : setSelectedCourse((prev) => prev)
                  }
                  key={index}
                  className={` ${
                    lecture.isPreviewFree
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                  } flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedLecture?.lectureTitle === lecture?.lectureTitle
                      ? "bg-gray-100 border-gray-400"
                      : ""
                  }`}
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lecture?.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className=" bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className=" aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center ">
              {selectedLecture?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedLecture?.videoUrl}
                  controls
                />
              ) : (
                <span className="text-white text-sm ">
                  Select a preview lecture to watch{" "}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className=" mt-8 border-t pt-6 ">
          <h2 className=" text-xl font-semibold mb-2">Write a Review</h2>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  onClick={() => setRating(star)}
                  key={star}
                  className={
                    star <= rating ? "fill-amber-300" : "fill-gray-300"
                  }
                />
              ))}
            </div>
            <textarea
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className=" w-full border border-gray-300 rounded-lg p-2"
              placeholder="Write your review here.."
              rows={3}
            />
            <button
              onClick={handleReview}
              disabled={loading}
              className=" bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800"
            >
              {loading ? (
                <ClipLoader size={30} color="white" />
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </div>
        {/* for creator info  */}
        <div className=" flex items-center pt-4 border-t gap-4 ">
          <img
            src={creatorData?.photoUrl ? creatorData.photoUrl : emptyImg}
            alt=""
            className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"
          />

          <div>
            <h2 className=" text-lg font-semibold">{creatorData?.name}</h2>
            <p className="md:text-sm text-gray-600 text-[10px]">
              {creatorData?.description}
            </p>
            <p className="md:text-sm text-gray-600 text-[10px]">
              {creatorData?.email}
            </p>
          </div>
        </div>

        <div>
          <p className=" text-xl font-semibold mb-2 ">
            Other Published courses by the Educator
          </p>
        </div>

        <div className=" w-full translate-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]">
          {createrCourses?.map((course, index) => (
            <Card
              key={index}
              thumbnail={course.thumbnail}
              id={course._id}
              price={course.price}
              title={course.title}
              category={course.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewCourses;
