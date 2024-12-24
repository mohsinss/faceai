import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import ButtonLead from "@/components/ButtonLead";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20 rounded-3xl shadow-lg">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight text-gray-900 mb-4 lg:mb-8">
          Revolutionize Your Workflow with Advanced AI Automation
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8 lg:mb-12 max-w-2xl">
          Harness the power of cutting-edge AI to streamline your processes, boost productivity, and unlock new possibilities for your business.
        </p>
        <button className="btn btn-primary btn-wide text-lg font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
          Start Automating Today
        </button>
        <ButtonLead />
        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
        <Image
          src="/ai-automation-hero.jpg"
          alt="Advanced AI Automation"
          className="w-full rounded-2xl shadow-2xl"
          priority={true}
          width={600}
          height={400}
        />
      </div>
    </section>
  );
};

export default Hero;
