import CmdPanel from "../../components/CmdPanel";
import ReactiveNodeBackground from "../../components/ReactiveNodeBackground";
import SlideIn from "../../components/SlideIn";

const Agent = () => {
  return (
    <div className="w-full max-w-full overflow-x-clip">
      <ReactiveNodeBackground />

      <SlideIn direction="top" delay={200} duration={1600} className="z-10 relative">
        <div className="relative z-10 p-8 sm:ml-32 sm:mt-16 text-primary-reddish">
          <h1 className="text-4xl font-bold mb-8">Here’s what I’m working on.</h1>
          <p className="text-[18px] w-[700px] mb-4 leading-relaxed">
            Agent is a fully agentic AI desktop app that completes any complex task across the OS using a lightweight, cloud-native inference stack. No local GPU weights required.
            <div className="my-4"/>
            Built with Python, PyTorch, and Hugging Face. At the moment, it uses a
            <a
              href="https://github.com/li21rich/omniparser-api-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-80"
            >
              {" "}self-hosted Microsoft OmniParser API
            </a>{" "}deployed on Fly.io GPUs for GUI object detection and Gemini (via OpenRouter) for MLLM and LLM embeddings.
          </p>
          <CmdPanel />
          <div className="mb-94" />
        </div>
      </SlideIn>
    </div>
  );
};

export default Agent;
