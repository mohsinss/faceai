import Image from "next/image";

const list = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechInnovate",
    text: "Advanced Automation has transformed our operations. The AI-driven insights have led to a 40% increase in efficiency.",
    img: "/testimonial-1.jpg",
  },
  {
    name: "Michael Chen",
    role: "Operations Manager, GlobalCorp",
    text: "The seamless integration and intuitive interface make Advanced Automation a game-changer for our complex workflows.",
    img: "/testimonial-2.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist, FutureTech",
    text: "As a data scientist, I'm impressed by the advanced algorithms. It's like having an AI assistant that truly understands our needs.",
    img: "/testimonial-3.jpg",
  },
];

const Testimonial = ({ i }) => {
  const testimonial = list[i];
  if (!testimonial) return null;

  return (
    <li key={i}>
      <figure className="relative h-full p-8 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <blockquote className="relative mb-6">
          <p className="text-gray-800 leading-relaxed">{testimonial.text}</p>
        </blockquote>
        <figcaption className="flex items-center space-x-4">
          <Image
            src={testimonial.img}
            alt={testimonial.name}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <div className="font-semibold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-600">{testimonial.role}</div>
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

const Testimonials3 = () => {
  return (
    <section id="testimonials" className="bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Trusted by Industry Leaders
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((e, i) => (
            <Testimonial key={i} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials3;
