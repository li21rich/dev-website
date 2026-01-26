import ArrowButton from "../components/ArrowButton";
import Brusher from "../components/Brusher";
import Cursor from "../components/Cursor";
import FadeIn from "../components/FadeIn";
import PanelCarousel from "../components/PanelCarousel";
import SlideIn from "../components/SlideIn";
import ReactiveNodeBackground from "../components/ReactiveNodeBackground";
import LakeImg from "../assets/lakemendota.jpg";
import NWFImg from "../assets/nwfstrategies.png";
import AgentImg from "../assets/agent.png";
import ESP32Img from "../assets/esp32.png";
import YAMImg from "../assets/yam.png";
import TwitterScrapeImg from "../assets/twitterscrape.png";
import PythonSvg from "../assets/python.svg";
import PyTorchSvg from "../assets/pytorch.svg";
import FlySvg from "../assets/fly.svg";
import DockerSvg from "../assets/docker.svg";
import GeminiSvg from "../assets/gemini.svg";
import HuggingFaceSvg from "../assets/huggingface.svg";
import VercelSvg from "../assets/vercel.svg";
import TailwindSvg from "../assets/tailwind.svg";
import TypescriptSvg from "../assets/typescript.svg";
import ReactSvg from "../assets/react.svg";
import ViteSvg from "../assets/vite.svg";
import ESPIDFSvg from "../assets/espidf.svg";
import CSvg from "../assets/c.svg";
import FreeRTOSSvg from "../assets/freertos.svg";
import CMakeSvg from "../assets/CMake.svg";
import NetlifySvg from "../assets/netlify.svg";
import JSSvg from "../assets/js.svg";
import SeleniumSvg from "../assets/selenium.svg";

const panels = [
  {
    image: AgentImg,
    link: "/agent",
    stack: [PythonSvg, PyTorchSvg, HuggingFaceSvg, DockerSvg, FlySvg, GeminiSvg]
  },
  {
    image: NWFImg,
    link: "https://nwfstrategies.com",
    stack: [TypescriptSvg, ReactSvg, ViteSvg, TailwindSvg, VercelSvg]
  },
  {
    image: ESP32Img,
    link: "https://drive.google.com/drive/folders/1bsd-UsG1Ua-wUnwbUodg4tPk-yWUh7ul?usp=sharing",
    stack: [CSvg,ESPIDFSvg, FreeRTOSSvg, CMakeSvg, DockerSvg]
  },
  {
    image: YAMImg,
    link: "https://www.youthartmovement.org",
    stack: [JSSvg,ReactSvg, NetlifySvg]
  },
  {
    image: TwitterScrapeImg,
    link: "https://github.com/li21rich/twitterscrape",
    stack: [PythonSvg,SeleniumSvg]
  },
];

const Home = () => {
  return (
    <>
      <ReactiveNodeBackground />
      
      <SlideIn direction="top" delay={200} duration = {1600} className="z-10 relative">
        <FadeIn>
          <div className="relative sm:ml-32 sm:mt-16 p-4 text-primary-reddish">
            <h1 className="text-5xl font-bold mb-4">richard li</h1>
            <p className="text-[18px] mb-4">cs (& math) @ uw-madison</p>
            <ArrowButton label="github" to="https://github.com/li21rich/"/>
            <ArrowButton label="linkedin" to="https://www.linkedin.com/in/richard-h-li/"/>
          </div>
        </FadeIn>
      </SlideIn>
      <PanelCarousel panels={panels} className = "my-50 overflow-auto"/>  
      <div className="w-full h-[470px]" />
      <Cursor />
    </>
  );
};

export default Home;
