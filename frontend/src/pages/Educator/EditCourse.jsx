import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState } from "react";
import { useRef } from "react";
import emptyImg from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";
function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectCourse, setSelectCourse] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const thumb = useRef();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendimage, setFrontendImage] = useState(emptyImg);
  const [backendimage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRem, setLoadingRem] = useState(false);
  const dispatch = useDispatch();
  const { courseData } = useSelector((store) => store.course);

  const handleThumbnail = (e) => {
    console.log(e);
    const file = e.target.files[0];
    console.log(file);
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEditCourse = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("thumbnail", backendimage);
    formData.append("isPublished", isPublished);
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + `/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data.data);
      const updateData = result.data.data;
      if (updateData.isPublished) {
        const updateCourses = courseData.map((c) =>
          c._id === courseId ? updateData : c
        );
        if (!courseData.some((c) => c._id === courseId)) {
          updateCourses.push(updateData);
        }
        dispatch(setCourseData(updateCourses));
      } else {
        const filterData = courseData.filter((c) => c._id !== courseId);
        dispatch(setCourseData(filterData));
      }
      setLoading(false);
      navigate("/courses");
      toast.success(result.data.message);
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error(e.response.data.message);
    }
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(
        BASE_URL + `/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );
      setSelectCourse(result.data.data);
      console.log(result.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveCourse = async () => {
    setLoadingRem(true);
    try {
      const result = await axios.delete(
        BASE_URL + `/api/course/remove/${courseId}`,
        { withCredentials: true }
      );
      console.log(result.data);
      const filterData = courseData.filter((c) => c._id !== courseId);
      dispatch(setCourseData(filterData));
      setLoadingRem(true);
      toast.success(result.data.message);
      navigate("/courses");
    } catch (e) {
      console.log(e);
      setLoadingRem(true);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    setTitle(selectCourse.title || "");
    setSubTitle(selectCourse.subTitle || "");
    setDescription(selectCourse.description || "");
    setIsPublished(selectCourse?.isPublished);
    setCategory(selectCourse.category || "");
    setFrontendImage(selectCourse.thumbnail || emptyImg);
    setLevel(selectCourse.level || "");
    setPrice(selectCourse.price || "");
  }, [selectCourse]);
  useEffect(() => {
    getCourseById();
  }, []);

  return (
    <div className=" max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* top bar  */}
      <div className="flex items-center justify-center gap-[20px] md:justify-center flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          onClick={() => navigate("/courses")}
          className="top[-20%] md:top-[20%] absolute left-0 md:left-[2%] w-[22px] h-[22px] cursor-pointer"
        />
        <h2 className=" text-2xl font-semibold md:pl-[60px] ">
          Add Detail Information regarding the course
        </h2>
        <div className="space-x-2 space-y-2 ">
          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className=" bg-black text-white px-4 py-2 rounded-md "
          >
            Go to Lecture page
          </button>
        </div>
      </div>

      {/* form details  */}
      <div className="bg-gray-50 p-6 rounded-md">
        <h2 className="text-lg font-medium mb-4">Basic Course Information</h2>
        <div className="space-x-2 space-y-2">
          <button
            onClick={() => setIsPublished((prev) => !prev)}
            className={`${
              isPublished
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            } px-4 py-2 rounded-md border-1`}
          >
            {isPublished ? "Click to UnPublish" : "Click to Publish"}
          </button>
          <button
            onClick={handleRemoveCourse}
            disabled={loadingRem}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-md border-1 cursor-pointer
            "
          >
            {loadingRem ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Remove Course"
            )}
          </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full border px-4 py-2 rounded-md mb-2 "
              placeholder="Course Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div>
            <label
              htmlFor="subTitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              SubTitle
            </label>
            <input
              type="text"
              id="subTitle"
              className="w-full border px-4 py-2 rounded-md mb-2 "
              placeholder="Course SubTitle"
              onChange={(e) => setSubTitle(e.target.value)}
              value={subTitle}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course Description
            </label>
            <textarea
              type="text"
              id="description"
              className="w-full border px-4 py-2 rounded-md h-24 resize-none mb-2 "
              placeholder="Course Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-2">
            {/* for category  */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Category
              </label>
              <select
                name=""
                id=""
                className="w-full border px-4 py-2 rounded-md bg-white mb-2"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Select Category</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI/UX Designing">UI/UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {/* for level  */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Level
              </label>
              <select
                name=""
                id=""
                className="w-full border px-4 py-2 rounded-md bg-white mb-2"
                onChange={(e) => setLevel(e.target.value)}
                value={level}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            {/* for price  */}
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Price (INR)
              </label>
              <input
                type="number"
                id="price"
                className="w-full border px-4 py-2 rounded-md mb-2"
                placeholder="₹"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1 "
            >
              Course Thumbnail
            </label>
            <input
              type="file"
              onChange={handleThumbnail}
              hidden
              ref={thumb}
              accept="image/*"
            />
          </div>
          <div className="relative w-[300px] h-[170px] mb-2">
            <img
              src={frontendimage}
              className="w-[100%] h-[100%] border-1 border-black rounded-[5px] mb-2"
              onClick={() => thumb.current.click()}
            />
            <FaEdit
              className="w-[20px] h-[20px] absolute top-2 right-2"
              onClick={() => thumb.current.click()}
            />
          </div>
          <div className="flex items-center justify-start gap-[15px] ">
            <button
              className="bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black cursor-pointer px-4 py-2 rounded-md"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>
            <button
              onClick={handleEditCourse}
              className=" bg-black text-white px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer"
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
