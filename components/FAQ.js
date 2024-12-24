"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How does AI automation improve my business processes?",
    answer: "AI automation enhances your business processes by analyzing large datasets, identifying patterns, and making intelligent decisions in real-time. This leads to increased efficiency, reduced errors, and improved scalability across various operations."
  },
  {
    question: "What types of tasks can be automated with AI?",
    answer: "AI can automate a wide range of tasks, including data analysis, customer service interactions, predictive maintenance, inventory management, personalized marketing, and complex decision-making processes. The possibilities are vast and can be tailored to your specific industry needs."
  },
  {
    question: "Is AI automation suitable for small businesses?",
    answer: "Absolutely! AI automation solutions can be scaled to fit businesses of all sizes. Small businesses can benefit from cost-effective AI tools that streamline operations, improve customer experiences, and provide valuable insights for growth."
  },
  {
    question: "How secure is AI automation for sensitive business data?",
    answer: "We prioritize data security in our AI automation solutions. We implement robust encryption, access controls, and compliance measures to protect your sensitive business data. Our systems are designed to meet industry standards and regulations for data privacy and security."
  },
  {
    question: "Can AI automation integrate with my existing systems?",
    answer: "Yes, our AI automation solutions are designed to integrate seamlessly with a wide range of existing systems and software. We offer flexible APIs and connectors to ensure smooth integration with your current tech stack, minimizing disruption to your operations."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                {activeIndex === index ? (
                  <FiMinus className="w-5 h-5 text-blue-500" />
                ) : (
                  <FiPlus className="w-5 h-5 text-blue-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
