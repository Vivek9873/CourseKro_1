import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import axios from "axios";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector((store) => store.lecture);
  const navigate = useNavigate();
  const selectedLecture = lectureData.find(
    (lecture) => lecture._id === lectureId
  );
  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture.lectureTitle || ""
  );
  const [videoUrl, setVidelUrl] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRem, setLoadingRem] = useState(false);
  const dispatch = useDispatch();

  const formData = new FormData();
  formData.append("lectureTitle", lectureTitle);
  formData.append("videoUrl", videoUrl);
  formData.append("isPreviewFree", isPreviewFree);
  console.log(isPreviewFree);

  const handleEditLecture = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + `/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setLectureData([...lectureData, result.data]));
      toast.success("Lecture Updated");
      navigate("/courses");
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };

  const removeLecture = async () => {
    setLoadingRem(true);
    try {
      const result = await axios.delete(
        BASE_URL + "/api/course/removelecture/" + lectureId,
        { withCredentials: true }
      );
      console.log(result.data);
      navigate("/createlecture/" + courseId);
      toast.success("Lecture Removed Successfully");
      setLoadingRem(false);
    } catch (e) {
      console.log(e);
      setLoadingRem(false);
      toast.error(e.response.data.message);
    }
  };

  return (
    <div className=" min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className=" w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* header  */}
        <div className=" flex items-center gap-2 mb-2">
          <FaArrowLeftLong
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className=" text-gray-600 cursor-pointer"
          />
          <h2 className="text-xl font-semibold text-gray-800  ">
            Update Course Lectures
          </h2>
        </div>

        {/* input area  */}
        <button
          disabled={loadingRem}
          onClick={removeLecture}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm"
        >
          {loadingRem ? (
            <ClipLoader size={30} color="white" />
          ) : (
            "Remove Lecture"
          )}
        </button>

        <div className="space-y-4 ">
          <div>
            <label
              htmlFor=""
              className=" block text-sm font-medium text-gray-700 mb-1"
            >
              Lecture Title *
            </label>
            <input
              onChange={(e) => setLectureTitle(e.target.value)}
              value={lectureTitle}
              required
              type="text"
              className=" w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor=""
              className=" block text-sm font-medium text-gray-700 mb-1"
            >
              Video *
            </label>
            <input
              onChange={(e) => setVidelUrl(e.target.files[0])}
              required
              type="file"
              className=" w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-500"
              accept="video/*"
            />
          </div>

          <div className=" flex items-center gap-3">
            <input
              onChange={() => setIsPreviewFree((prev) => !prev)}
              type="checkbox"
              className="accent-black h-4 w-4 "
              id="isFree"
            />
            <label htmlFor="isFree" className="text-sm text-gray-700">
              Is this video FREE?
            </label>
          </div>
          {loading ? <p>Uploading video... Please wait!</p> : <></>}
        </div>
        <div className="pt-4 ">
          <button
            onClick={handleEditLecture}
            disabled={loading}
            className=" w-full bg-black text-white py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition"
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Update Lecture"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;
