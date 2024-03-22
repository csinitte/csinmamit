import { TestimonialList } from "@/lib/constants";
import AnimatedGradientText from "../AnimatedGradientText";
import Testimonial from "./Testimonial";

const Testimonials = () => {
  return (
    <section className="bg-white text-black transition-colors duration-500 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6">
        <AnimatedGradientText>Testimonials</AnimatedGradientText>
        <p className=" text-zinc-700 sm-text-l font-semibold text-center pb-5 pt-5">
          Explore testimonials showcasing the impactful experiences and growth
          stories within the CSI.
        </p>

        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
            {TestimonialList.map((testimonial, id) => (
              <Testimonial
                key={id}
                image="https://github.com/dhanushlnaik.png"
                name={testimonial.name}
                position={testimonial.position}
                company={testimonial.company}
                testimonial={testimonial.testimonial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
