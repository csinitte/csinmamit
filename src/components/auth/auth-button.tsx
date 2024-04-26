import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { DoorClosed, DoorOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
export default function AuthButton() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Image
              src={user?.image ?? "/favicon.ico"}
              alt={user?.name ?? "img-av"}
              height={500}
              width={500}
              className="h-10 w-10 rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-0.5 leading-none">
                <p className="text-sm font-medium text-black">
                  {session?.user.name}
                </p>

                <p className="w-[200px] truncate text-xs text-zinc-700">
                  {user?.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile">Your Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/">Dashboard</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <Button
                variant={"destructive"}
                onClick={() => signOut()}
                className="w-full"
              >
                Sign Out <DoorClosed />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          className="gap-2"
          onClick={async () => {
            await signIn();
          }}
        >
          Log In <DoorOpen />
        </Button>
      )}
    </>
  );
}
