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
import { useAuth } from "~/lib/firebase-auth";

export default function AuthButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                  {user.name}
                </p>

                <p className="w-[200px] truncate text-xs text-zinc-700">
                  {user.email}
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
                onClick={handleSignOut}
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
          onClick={handleSignIn}
        >
          Log In <DoorOpen />
        </Button>
      )}
    </>
  );
}
