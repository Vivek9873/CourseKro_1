import React, { useState } from "react";
import logo from "../assets/CK_logo.png";
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setUser } from "../redux/userSlice";
import { toast } from "react-toastify";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiSplitCross } from "react-icons/gi";

const Nav = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [ham, setHam] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.get(BASE_URL + "/api/auth/logout", { withCredentials: true });
      dispatch(setUser(null));
      toast.success("Logout Successfully");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };
  return (
    <div>
      <div className="w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10">
        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt="logo"
            className="w-[60px] rounded-[5px] border-2 border-white"
          />
        </div>
        <div className="w-[30%] lg:flex items-center justify-center gap-4 hidden">
          {!user && (
            <IoPersonCircle
              onClick={() => setShow((prev) => !prev)}
              className="w-[50px] h-[50px] fill-black cursor-pointer"
            />
          )}

          {user?.photoUrl ? (
            <img
              onClick={() => setShow((prev) => !prev)}
              src={user?.photoUrl}
              className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
            />
          ) : (
            <div
              onClick={() => setShow((prev) => !prev)}
              className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
            >
              {user?.name.slice(0, 1).toUpperCase()}
            </div>
          )}

          {user?.role === "educator" && (
            <div
              onClick={() => navigate("/dashboard")}
              className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white bg-[black] text-black rounded-[10px] text-[18px] font-light  cursor-pointer"
            >
              Dashboard
            </div>
          )}
          {!user ? (
            <span
              onClick={() => navigate("/login")}
              className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white bg-[black] text-black rounded-[10px] text-[18px] font-light  cursor-pointer"
            >
              Login
            </span>
          ) : (
            <span
              onClick={handleLogout}
              className="px-[20px] py-[10px]  bg-[white] text-black rounded-[10px] text-[18px] shadow-sm  cursor-pointer"
            >
              Logout
            </span>
          )}
          {show && (
            <div className="absolute top-[110%] right-[15%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-[2px] border-black hover:border-white hover:text-white cursor-pointer hover:bg-black">
              <span
                onClick={() => navigate("/profile")}
                className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
              >
                My Profile
              </span>
              <span
                onClick={() => navigate("/mycourses")}
                className="bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600"
              >
                My Courses
              </span>
            </div>
          )}
        </div>
        <RxHamburgerMenu
          onClick={() => setHam((prev) => !prev)}
          className="w-[35px] h-[35px] lg:hidden text-white cursor-pointer"
        />

        <div
          className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${
            ham
              ? "translate-x-[0] transition duration-600"
              : "translate-x-[-100%] transition duration-600 "
          }`}
        >
          <GiSplitCross
            onClick={() => setHam((prev) => !prev)}
            className="w-[35px] h-[35px] fill-white absolute top-5 right-[4%]"
          />
          {!user && (
            <IoPersonCircle className="w-[50px] h-[50px] fill-black cursor-pointer" />
          )}

          {user?.photoUrl ? (
            <img
              onClick={() => setShow((prev) => !prev)}
              src={user?.photoUrl}
              className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
            />
          ) : (
            <div className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer">
              {user?.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div
            className=" flex items-center justify-center w-[200px] h-[65px] border-2 border-white  text-white bg-[black]  rounded-[10px] text-[18px] font-light  cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </div>
          <div
            onClick={() => navigate("/mycourses")}
            className=" flex items-center justify-center w-[200px] h-[65px] border-2 border-white  text-white bg-[black]  rounded-[10px] text-[18px] font-light  cursor-pointer"
          >
            My Courses
          </div>
          {user?.role === "educator" && (
            <div
              onClick={() => navigate("/dashboard")}
              className=" flex items-center justify-center w-[200px] h-[65px] border-2 border-white  text-white bg-[black]  rounded-[10px] text-[18px] font-light  cursor-pointer"
            >
              Dashboard
            </div>
          )}

          {!user ? (
            <span
              onClick={() => navigate("/login")}
              className=" flex items-center justify-center w-[200px] h-[65px] border-2 border-white  text-white bg-[black]  rounded-[10px] text-[18px] font-light  cursor-pointer"
            >
              Login
            </span>
          ) : (
            <span
              onClick={handleLogout}
              className=" flex items-center justify-center w-[200px] h-[65px] border-2 border-white  text-white bg-[black]  rounded-[10px] text-[18px] font-light  cursor-pointer"
            >
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
