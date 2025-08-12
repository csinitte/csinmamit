import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { GitHubLogoIcon as GithubIcon } from "@radix-ui/react-icons";
import { LinkedinIcon } from "lucide-react";

interface TeamMemberProps {
  // email: string | null;
  name: string;
  branch: string;
  position: string;
  linkedin: string | null;
  github: string | null;
  imageSrc: string;
  _year: number;
  _order: number;
}

export const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  position,
  linkedin,
  github,
  imageSrc,
  _year,
  _order
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
            className="h-full w-full rounded-md object-cover object-[center_20%]"
          />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold line-clamp-1">{name}</h2>
        <p className="text-sm sm:text-base text-blue-500 line-clamp-1">{position}</p>
        <div className="mt-3 sm:mt-4 flex justify-center gap-3 sm:gap-4">
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-colors hover:text-blue-500",
            })}
            href={linkedin ?? "#"}
            target="_blank"
            aria-label={`${name}'s LinkedIn`}
          >
            <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-colors hover:text-gray-600",
            })}
            href={github ? `${github}` : "#"}
            target="_blank"
            aria-label={`${name}'s GitHub`}
          >
            <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
