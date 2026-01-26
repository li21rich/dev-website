import ArrowButton from "../components/ArrowButton";
import Brusher from "../components/Brusher";
import Cursor from "../components/Cursor";
import FadeIn from "../components/FadeIn";
import PanelCarousel from "../components/PanelCarousel";
import SlideIn from "../components/SlideIn";
import ReactiveNodeBackground from "../components/ReactiveNodeBackground";
import lakeImg from "../assets/lakemendota.jpg";

const panels = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    link: "/agent"
  },
  {
    image: lakeImg,
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
            <h1 className="text-5xl font-bold mb-4">Richard Li</h1>
            <p className="text-[18px] mb-4">CS (& Math) @ UW-Madison</p>
            <ArrowButton label="GitHub" to="https://github.com/li21rich/"/>
            <ArrowButton label="LinkedIn" to="https://www.linkedin.com/in/richard-h-li/"/>
          </div>
        </FadeIn>
      </SlideIn>
      <PanelCarousel panels={panels} className = "mt-46 mb-30  overflow-auto"/>  
      <div className="mt-120 w-full h-[200px]">
        <Brusher image={lakeImg} />
      </div>
      <Cursor />
    </>
  );
};

export default Home;
