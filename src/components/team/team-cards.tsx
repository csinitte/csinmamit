import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { GitHubLogoIcon as GithubIcon } from "@radix-ui/react-icons";
import { LinkedinIcon } from "lucide-react";

interface TeamMemberProps {
  email: string | null;
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
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-blue-500">{position}</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "rounded-full transition-colors hover:text-blue-500",
            })}
            href={linkedin ?? "#"}
            target="_blank"
          >
            <LinkedinIcon size={24} />
          </Link>
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "rounded-full  transition-colors hover:text-gray-600",
            })}
            href={github ?? "#"}
            target="_blank"
          >
            <GithubIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};
