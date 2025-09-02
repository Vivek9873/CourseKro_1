import { useState } from "react";
import logo from "../assets/CK_logo.png";
import google from "../assets/google.jpg";
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/auth/signup",
        { name, email, password, role },
        { withCredentials: true }
      );
      console.log(result);
      dispatch(setUser(result.data.data));
      setLoading(false);
      navigate("/");
      toast.success("SignUp Successfully");
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error(e.response.data.message);
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      // console.log(response);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;

      const result = await axios.post(
        BASE_URL + "/api/auth/googleauth",
        { name, email, role },
        { withCredentials: true }
      );
      dispatch(setUser(result.data.data));
      navigate("/");
      toast.success("Signup Successfull");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };
  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
      >
        {/* left div  */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
          <div>
            <h1 className="font-semibold text-[black] text-2xl">
              Let's get started
            </h1>
            <h2 className="text-[#999797] text-[18px]">Create your account</h2>
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type="email"
              id="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <IoEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <IoEyeOutline
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>
          <div className="flex md:w-[50%] w-[70%] items-center justify-between">
            <span
              onClick={() => setRole("student")}
              className={` ${
                role === "student" ? "border-[black]" : "border-[#e7e6e6]"
              }  px-[10px] py-[5px] border-[2px]  rounded-xl cursor-pointer hover:border-black`}
            >
              Student
            </span>
            <span
              onClick={() => setRole("educator")}
              className={` ${
                role === "educator" ? "border-[black]" : "border-[#e7e6e6]"
              }  px-[10px] py-[5px] border-[2px]  rounded-xl cursor-pointer hover:border-black`}
            >
              Educator
            </span>
          </div>
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
          </button>
          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">
              Or continue
            </div>
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
          </div>
          <div
            className="w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center cursor-pointer"
            onClick={googleSignUp}
          >
            <img src={google} className="w-[25px]" alt="GoogleLogo" />
            <span className="text-[18px] text-gray-500">oogle</span>
          </div>
          <div>
            <div className="text-[#6f6f6f]">
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className=" cursor-pointer underline underline-offset-1"
              >
                Login
              </span>
            </div>
          </div>
        </div>
        {/* right div  */}
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
          <img className="w-30 shadow-2xl" src={logo} alt="App-logo" />
          <span className="text-2xl font-bold text-white">CourseKro</span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
