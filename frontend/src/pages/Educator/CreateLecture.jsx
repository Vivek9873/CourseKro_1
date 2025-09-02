import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((store) => store.lecture);

  const handleCreateLecture = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + `/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setLectureData([...lectureData, result.data.lecture]));
      setLoading(false);
      toast.success("Lecture Created Successfully");
      setLectureTitle("");
    } catch (e) {
      console.log(e);
      setLectureTitle("");
      setLoading(false);
      toast.error(e.response.data.message);
    }
  };

  const getCourseLecture = async () => {
    try {
      const result = await axios.get(
        BASE_URL + "/api/course/courselecture/" + courseId,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setLectureData(result.data.lectures));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getCourseLecture();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        {/* header  */}
        <div className="mb-6 ">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Create Course Lectures
          </h1>
          <p className=" text-sm text-gray-50 ">
            Enter the title and add your video lectures to enhance your course
            content
          </p>
        </div>

        {/* input area */}
        <input
          type="text"
          onChange={(e) => setLectureTitle(e.target.value)}
          value={lectureTitle}
          placeholder="e.g. Introduction to Mern Stack"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4"
        />

        {/* button  */}
        <div className=" flex gap-4 mb-6 ">
          <button
            onClick={() => navigate(`/editcourse/${courseId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium  "
          >
            <FaArrowLeftLong className="" />
            Back to Course
          </button>
          <button
            disabled={loading}
            onClick={handleCreateLecture}
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-600 translate-all text-sm font-medium shadow"
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "+ Create Lecture"
            )}
          </button>
        </div>
        {/* lecture list  */}
        <div className="space-y-2">
          {lectureData?.map((lecture, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700"
            >
              <span>
                Lecture - {index + 1} : {lecture.lectureTitle}
              </span>
              <FaEdit
                className="text-gray-500 hover:text-gray-700 cursor-pointer "
                onClick={() =>
                  navigate(`/editlecture/${courseId}/${lecture._id}`)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
