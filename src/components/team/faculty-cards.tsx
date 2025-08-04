import Image from "next/image";

interface FacProps {
  name: string;
  position: string;
  imageSrc: string;
  branch: string;
}

export const Faculty: React.FC<FacProps> = ({
  name,
  position,
  branch,
  imageSrc,
}) => {
  return (
    <div className="-m-1 sm:-m-2 rounded-lg sm:rounded-xl bg-gray-900/5 p-3 sm:p-4 ring-1 ring-inset ring-gray-900/10 transition-all hover:ring-blue-500 lg:-m-4 lg:rounded-2xl lg:p-6">
      <div className="flex items-center justify-center p-2 sm:p-4">
        <div className="relative h-32 w-32 xs:h-40 xs:w-40 sm:h-48 sm:w-48 overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            width={250}
            height={250}
            alt={`${name} - ${position}`}
            quality={100}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-1">{name}</h2>
        <p className="text-sm sm:text-base font-semibold text-red-500">{branch}</p>
        <p className="text-sm sm:text-base text-blue-500 line-clamp-1">{position}</p>
      </div>
    </div>
  );
};
