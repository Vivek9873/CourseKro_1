import axios from "axios";
import React from "react";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCreateCourse = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/course/create",
        { title, category },
        { withCredentials: true }
      );
      console.log(result.data.data);
      setLoading(false);
      navigate("/courses");
      toast.success(result.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative">
        <FaArrowLeftLong
          onClick={() => navigate("/courses")}
          className="top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer"
        />
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Course
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1 "
              htmlFor="title"
            >
              Course Title
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]"
              id="title"
              type="text"
              placeholder="Enter Course Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1 "
              htmlFor="cat"
            >
              Course Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              id="cat"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]"
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
          <button
            onClick={handleCreateCourse}
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
