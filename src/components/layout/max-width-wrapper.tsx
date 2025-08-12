import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "md:px-15 mx-auto w-full max-w-screen-2xl px-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
