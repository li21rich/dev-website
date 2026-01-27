import ArrowButton from "../components/ArrowButton";
import PanelCarousel from "../components/PanelCarousel";
import SlideIn from "../components/SlideIn";
import ReactiveNodeBackground from "../components/ReactiveNodeBackground";
import { PORTFOLIO_PROJECTS } from "../constants/DivConstants";

const Home = () => {
  return (
    <div className="w-full max-w-full overflow-x-clip">
      <ReactiveNodeBackground />
      <SlideIn direction="top" delay={200} duration={2000} className="z-10 relative">
        <div className="relative sm:ml-32 sm:mt-16 p-4 text-primary-reddish">
          <h1 className="text-5xl font-bold mb-4">richard li</h1>
          <p className="text-[18px] mb-4">cs (& math) @ uw-madison</p>
          <ArrowButton label="github" to="https://github.com/li21rich/" />
          <ArrowButton label="linkedin" to="https://www.linkedin.com/in/richard-h-li/" />
        </div>
      </SlideIn>
      <SlideIn direction="bottom" delay={1000} duration={1500}>
        <PanelCarousel panels={PORTFOLIO_PROJECTS} className="my-50 overflow-auto" />
      </SlideIn>
      <div className="w-full h-[450px]" />
    </div>
  );
};

export default Home;
