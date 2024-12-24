import React from "react";
import Image from "next/image";

const Problem = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-red-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">
            The Challenge of Manual Workflows
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Traditional manual processes are time-consuming, error-prone, and limit your business&apos;s potential for growth and innovation.
          </p>
          <ul className="space-y-4 text-gray-700">
            <li>• Inefficient resource allocation</li>
            <li>• Increased risk of human error</li>
            <li>• Limited scalability</li>
            <li>• Difficulty in data-driven decision making</li>
          </ul>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/manual-workflow-problem.jpg"
            alt="Manual Workflow Challenges"
            className="rounded-2xl shadow-2xl"
            width={600}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Problem;
