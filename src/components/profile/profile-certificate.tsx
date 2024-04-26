import Image from "next/image";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
const Certificates = () => {
  return (
    <MaxWidthWrapper className="mb-12 mt-9 flex flex-col items-center justify-center text-center sm:mt-12">
      <h1
        className={`bg-gradient-to-b from-blue-600 to-violet-400 bg-clip-text pb-4 text-center text-4xl font-black text-transparent`}
      >
        Certificates
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                    <div
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
                    >
                                      <Image
                    src={"/certi.png"}
                    alt={"certi"}
                    width={500}
                    height={500}
                    className="mb-2"
                  />
               
                    </div>

      <div className="my-8">
        {/* <h2 className="mb-4 text-2xl font-semibold">SS</h2> */}
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          Nothing Here
        </div> */}

  
                  </div>
                  </div>
    </MaxWidthWrapper>
  );
};

export default Certificates;
