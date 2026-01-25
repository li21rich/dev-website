import ArrowButton from "../components/ArrowButton";
import Brusher from "../components/Brusher";
import Cursor from "../components/Cursor";
import FadeIn from "../components/FadeIn";
import PanelCarousel from "../components/PanelCarousel";
import SlideIn from "../components/SlideIn";
import ReactiveNodeBackground from "../components/ReactiveNodeBackground";

const panels: string[] = [1, 2, 3].map((i) => `Panel ${i}`);

const Home = () => {
  return (
    <>
      <ReactiveNodeBackground />

      <div className="relative z-10 px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Richard Li</h1>

        <SlideIn direction="left">
          <FadeIn>
            <p className="text-lg mb-6">Some placeholder text fading in.</p>
          </FadeIn>
        </SlideIn>

        <ArrowButton label="Hello world" to="/home" />
        <div className="my-8 h-[400px] w-full relative">
          <Brusher image="lakemendota.jpg" />
        </div>

        <div className="mt-8">
          <PanelCarousel panels={panels} />
        </div>
      </div>

      <Cursor />
    </>
  );
};

export default Home;
