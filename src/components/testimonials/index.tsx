import AnimatedGradientText from "../AnimatedGradientText";
import Testimonial from "./Testimonial";




const TestimonialList = [
    {
      image: "/assets/testimonials/sanath.jpeg",
      name: "Sanath R Pai",
      position: "Associate Technical Support Engineer",
      company: "VMware",
      testimonial: `
      I have done several Projects under Finite Loop Club and I have learnt a lot of cutting edge
      technologies. The Club focuses on peer to peer learning mechanisms and has been successful in
      efficiently creating a community for developers and coding enthusiasts. The clubs CTF event helped a
      lot of people understand cyber security techniques as well!!
      Overall it would be great opportunity for any individual interested in the field of IT to be a part of
      Finite Loop Club family
      `,
    },
    {
      image: "/assets/testimonials/rahul.jpeg",
      name: "Rahul Sheregar",
      position: "Software Engineer",
      company: "Sony India Software Center PrivateLTD.",
      testimonial: `
      Finite Loop gave me all the technical and non technical experience required for my IT career. Finite
      Loop conducts various IT and non IT events shaping the budding minds of upcoming new engineer.
      `,
    },
    {
      image: "/assets/testimonials/shravya.jpeg",
      name: "Shravya S Rao",
      position: "VMCloud Support Engineer",
      company: "VMware",
      testimonial:
        "I am really happy to be a part of this community. I have learned a lot from the community and I am really thankful to all the members of the community for their support and guidance. I am really looking forward to be a part of this community for a long time.",
    },
    {
      image: "/assets/testimonials/melroy.jpeg",
      name: "Melroy Neil Dsouza ",
      position: "Programmer Analyst",
      company: "Oracle",
      testimonial: `
      As a former member, I am proud of what the club has become. The club gave me the push I needed to
      learn new technologies and apply the newfound knowledge on real world projects. It gave me the
      experience I needed to jump start my career.
      `,
    },
    {
      image: "/assets/testimonials/saheer.jpeg",
      name: "Saheer Abdul Rehman",
      position: "SDE ",
      company: "Hashedin by Deloitte",
      testimonial: `
      Finiteloop gave me opportunities to work on cutting edge technologies through real-time projects. It made me confident and helped me hone my skills. The club emphasizes team work, leadership and self-empowerment. I feel immensely fortunate to have been part of such a wonderful team.
      `,
    },
    {
      image: "/assets/testimonials/pooja.jpeg",
      name: "Pooja Shetty",
      position: "Associate Software Engineer ",
      company: "Robert Bosch Engineering Pvt. Ltd.",
      testimonial: `
      The Finiteloop Club has not only shaped me as a student, but also a professional. Being part of the
      club has helped build my confidence in being a leader, given me great people to connect with, and
      given me the incredible opportunity to learn and share new skills.
      `,
    },
    {
      image: "/assets/testimonials/shashank.jpeg",
      name: "Shashank Shetty",
      position: "Senior Software Engineer",
      company: "Goibibo",
      testimonial: `
      My journey with a finite loop has been a blessing altogether. It had given me a platform, where I was able to build, learn and grow both professional and personal. I met some really amazing people here. Who encouraged me to do more and gave me courage to uplift my life. Being an industrial professional I can say, finite loop really gives us the edge over the others. It gave me exposure to cooperate work style as well as opportunity to work on the latest technologies. Being an tech enthusiastic, I would highly recommend people to take part with Finite loop and their activities.       
      `,
    },
  ];


const Testimonials = () => {
  return (
    <section className="bg-white text-black transition-colors duration-500 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6">

        <AnimatedGradientText>
        Testimonials
        </AnimatedGradientText>
        <p className=" text-zinc-700 sm-text-l font-semibold text-center pb-5 pt-5">
        Explore testimonials showcasing the impactful experiences and growth stories within the CSI.
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