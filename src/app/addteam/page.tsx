import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import AddTeam from "@/components/AddTeam";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "./../../lib/utils";

const Add = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/");

  const dbUser = await db.team.findFirst({
    where: {
      custid: user.id,
    },
  });

  return (
    <div>
      {dbUser ? (
        <MaxWidthWrapper className="text-center mb-10">
          <h1 className="max-w-4xl text-3xl font-bold md:text-5xl lg:text-6xl justify-center text-center pt-10 pb-10">
            Your Account already Exists :D
          </h1>
          <Link
            className={buttonVariants({
              size: "lg",
              className: "items-center justify-center text-center",
            })}
            href={"/team"}
            target="_blank"
          >
            Checkout the Team <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </MaxWidthWrapper>
      ) : (
        <AddTeam />
      )}
    </div>
  );
};

export default Add;
