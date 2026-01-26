import ArrowButton from "../../components/ArrowButton";
import ReactiveNodeBackground from "../../components/ReactiveNodeBackground";
import SlideIn from "../../components/SlideIn";
import FadeIn from "../../components/FadeIn";

const Agent = () => {
  return (
    <>
      <ReactiveNodeBackground />
      
      <SlideIn direction="top" delay={200} duration = {1600} className="z-10 relative">
        <FadeIn>
            <div className="relative z-10 p-8 sm:ml-32 sm:mt-16 text-primary-reddish">
                <h1 className="text-4xl font-bold mb-4">Agent Project</h1>
                <p className="text-[18px] mb-4">
                AI agent built with Python, PyTorch, HuggingFace, and deployed via Fly & Docker.
                </p>
                <div className="flex gap-4 mb-6">
                <ArrowButton label="github" to="https://github.com/li21rich/agent" />
                <ArrowButton label="demo" to="https://agent.fly.dev" />
                </div>
            </div>
        </FadeIn>
      </SlideIn>
    </>
  );
};

export default Agent;
