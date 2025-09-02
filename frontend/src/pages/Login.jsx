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
import { FaArrowLeftLong } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(result);
      dispatch(setUser(result.data.data));
      setLoading(false);
      navigate("/");
      toast.success("Login Successfull");
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error(e.response.data.message);
    }
  };
  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      // console.log(response);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;
      let role = "";
      const result = await axios.post(
        BASE_URL + "/api/auth/googleauth",
        { name, email, role },
        { withCredentials: true }
      );
      dispatch(setUser(result.data.data));
      navigate("/");
      toast.success("Login Successfull");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };
  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center ">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex relative"
      >
        <FaArrowLeftLong
          className=" absolute top-[3%] md:top-[16%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* left div  */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
          <div>
            <h1 className="font-semibold text-[black] text-2xl">
              Welcome Back
            </h1>
            <h2 className="text-[#999797] text-[18px]">
              Login to your account
            </h2>
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
          <button
            onClick={handleLogin}
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Login"}
          </button>
          <span
            className="text-[13px] cursor-pointer text-[#585757]"
            onClick={() => navigate("/forget")}
          >
            Forget your password?
          </span>
          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">
              Or continue
            </div>
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
          </div>
          <div
            onClick={googleLogin}
            className="w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center cursor-pointer"
          >
            <img src={google} className="w-[25px]" alt="GoogleLogo" />
            <span className="text-[18px] text-gray-500">oogle</span>
          </div>
          <div>
            <div className="text-[#6f6f6f]">
              New User?
              <span
                onClick={() => navigate("/signup")}
                className=" cursor-pointer underline underline-offset-1"
              >
                Sign Up
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

export default Login;
