import ArrowButton from "../components/ArrowButton";
import Cursor from "../components/Cursor";
import FadeIn from "../components/FadeIn";
import PanelCarousel from "../components/PanelCarousel";
import SlideIn from "../components/SlideIn";
import ReactiveNodeBackground from "../components/ReactiveNodeBackground";
import { PORTFOLIO_PROJECTS } from "../constants/DivConstants";  

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
      <PanelCarousel panels={PORTFOLIO_PROJECTS} className = "my-50 overflow-auto"/>  
      <div className="w-full h-[470px]" />
      <Cursor />
    </>
  );
};

export default Home;
