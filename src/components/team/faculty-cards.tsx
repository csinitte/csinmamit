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
    <div className="-m-2 rounded-xl bg-gray-900/5 p-4 ring-1 ring-inset ring-gray-900/10 transition-all hover:ring-blue-500 lg:-m-4 lg:rounded-2xl lg:p-6">
      <div className="flex items-center justify-center gap-4 p-4">
        <div className="relative h-48 w-48 overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            width={250}
            height={250}
            alt="main-image"
            quality={100}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="font-semibold text-red-500">{branch}</p>
        <p className="text-blue-500">{position}</p>
      </div>
    </div>
  );
};
