import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { useGetUser } from "./customHooks/useGetUser";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCourse from "./pages/Educator/CreateCourse";
import EditCourse from "./pages/Educator/EditCourse";
import AllCourses from "./pages/AllCourses";
import useGetPublishedCourse from "./customHooks/userGetPublishedCourse";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourses from "./pages/ViewCourses";
import ScrollToTop from "./component/ScrollToTop";
import ViewLecture from "./pages/ViewLecture";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import useGetCreatorCourses from "./customHooks/useGetCreatorCourses";
import useGetAllReviews from "./customHooks/useGetAllReviews";
import SearchWithAi from "./pages/SearchWithAi";

const App = () => {
  useGetUser();
  useGetPublishedCourse();
  useGetCreatorCourses();
  useGetAllReviews();

  const { user } = useSelector((store) => store.user);
  console.log(user);
  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route
          path="/editprofile"
          element={user ? <EditProfile /> : <Navigate to={"/login"} />}
        />
        <Route path="/allcourses" element={<AllCourses />} />
        <Route
          path="/dashboard"
          element={
            user?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/courses"
          element={
            user?.role === "educator" ? <Courses /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/createcourse"
          element={
            user?.role === "educator" ? (
              <CreateCourse />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/editcourse/:courseId"
          element={
            user?.role === "educator" ? (
              <EditCourse />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            user?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            user?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/viewcourse/:courseId"
          element={user ? <ViewCourses /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/viewlecture/:courseId"
          element={user ? <ViewLecture /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/mycourses"
          element={user ? <MyEnrolledCourses /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/search"
          element={user ? <SearchWithAi /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </>
  );
};

export default App;
