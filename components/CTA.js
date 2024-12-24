import Image from "next/image";

const CTA = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="relative z-10 max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Elevate Your Business with AI-Powered Automation
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-3xl">
          Don&apos;t let manual processes hold you back. Embrace the future of work with our advanced AI solutions.
        </p>
        <button className="btn btn-primary btn-lg text-lg font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
          Start Your AI Journey
        </button>
      </div>
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/ai-background.jpg"
          alt="AI Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </section>
  );
};

export default CTA;
