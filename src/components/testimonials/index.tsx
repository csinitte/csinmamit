import { TestimonialList } from "~/lib/constants";
import Testimonial from "./Testimonial";

const Testimonials = () => {
  return (
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
  );
};

export default Testimonials;
