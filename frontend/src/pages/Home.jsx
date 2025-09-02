import Nav from "../component/Nav";
import homelogo from "../assets/home1.jpg";
import { SiViaplay } from "react-icons/si";
import whtAiLogo from "../assets/ai.png";
import blkAiLogo from "../assets/SearchAi.png";
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import About from "../component/About";
import Footer from "../component/Footer";
import ReviewPage from "../component/ReviewPage";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="w-[100%] overflow-hidden">
      <div className="w-[100%] lg:h-[140vh] h-[70vh] relative">
        <Nav />
        <img
          src={homelogo}
          className="object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh] "
          alt="homeLogo"
        />
        <span className="lg:text-[70px] absolute md:text-[40px] lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px] ">
          Grow Your Skills to Advance
        </span>
        <span className="lg:text-[70px] absolute md:text-[40px] lg:top-[18%] top-[20%] w-[100%] flex items-center justify-center text-white font-bold text-[20px]">
          Your Career Path
        </span>
        <div className="absolute lg:top-[30%] top-[75%] md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("/allcourses")}
            className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer"
          >
            View All Courses{" "}
            <SiViaplay className=" w-[30px] h-[30px] lg:fill-white fill-black" />
          </button>
          <button
            onClick={() => navigate("/search")}
            className="px-[20px] py-[10px] lg:bg-white bg-black lg:text-black text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer items-center justify-center"
          >
            Search With Ai{" "}
            <img
              src={whtAiLogo}
              alt=""
              className="w-[30px] h-[30px] rounded-full hidden lg:block"
            />
            <img
              src={blkAiLogo}
              alt=""
              className="w-[30px] h-[30px] rounded-full  lg:hidden"
            />
          </button>
        </div>
      </div>
      <Logos />
      <ExploreCourses />
      <CardPage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  );
}

export default Home;
