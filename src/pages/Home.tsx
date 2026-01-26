import ArrowButton from "../components/ArrowButton";
import Brusher from "../components/Brusher";
import Cursor from "../components/Cursor";
import FadeIn from "../components/FadeIn";
import PanelCarousel from "../components/PanelCarousel";
import SlideIn from "../components/SlideIn";
import ReactiveNodeBackground from "../components/ReactiveNodeBackground";
import LakeImg from "../assets/lakemendota.jpg";
import AgentImg from "../assets/agent.png";
import PythonSvg from "../assets/python.svg";
import PyTorchSvg from "../assets/pytorch.svg";
import FlySvg from "../assets/fly.svg";
import DockerSvg from "../assets/docker.svg";
import GeminiSvg from "../assets/gemini.svg";
import HuggingFaceSvg from "../assets/huggingface.svg";

const panels = [
  {
    image: AgentImg,
    link: "/agent",
    stack: [PythonSvg, PyTorchSvg, HuggingFaceSvg, DockerSvg, FlySvg, GeminiSvg]
  },
  {
    image: LakeImg,
    link: "https://yourlink.com",
  },
  {
    image: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400",
    link: "https://nwfstrategies.com"
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
      <PanelCarousel panels={panels} className = "mt-46 mb-30  overflow-auto"/>  
      <div className="mt-120 w-full h-[200px]">
        <Brusher image={LakeImg} />
      </div>
      <Cursor />
    </>
  );
};

export default Home;
