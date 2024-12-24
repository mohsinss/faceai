import React from "react";
import { FiCpu, FiBarChart2, FiLayers, FiShield } from "react-icons/fi";

const features = [
  {
    title: "Intelligent Process Optimization",
    description: "Our AI analyzes your workflows and suggests optimizations to save time and resources.",
    icon: <FiCpu className="w-10 h-10 text-blue-500" />,
    styles: "bg-blue-50 text-blue-900",
  },
  {
    title: "Predictive Analytics",
    description: "Leverage machine learning to forecast trends and make data-driven decisions.",
    icon: <FiBarChart2 className="w-10 h-10 text-green-500" />,
    styles: "bg-green-50 text-green-900",
  },
  {
    title: "Seamless Integration",
    description: "Easily connect our AI solutions with your existing tools and platforms.",
    icon: <FiLayers className="w-10 h-10 text-purple-500" />,
    styles: "bg-purple-50 text-purple-900",
  },
  {
    title: "Advanced Security Measures",
    description: "State-of-the-art encryption and compliance to keep your data safe and secure.",
    icon: <FiShield className="w-10 h-10 text-red-500" />,
    styles: "bg-red-50 text-red-900",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Powerful AI Features to Transform Your Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.styles} rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold ml-4">{feature.title}</h3>
              </div>
              <p className="text-base opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
