import { LinkedinIcon, Github } from "lucide-react";
import { useAuth } from "~/lib/firebase-auth";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { buttonVariants } from "~/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";
import { env } from "~/env";


interface MembershipData {
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    paymentDate: Date | { toDate(): Date };
  };
  role: string;
  csiIdNumber?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        if (userDoc.exists()) {
          const data = userDoc.data() as Record<string, unknown>;
          setUserData(data);
          if (data.membershipType) {
            const membershipEndDateRaw = data.membershipEndDate as { toDate?: () => Date } | Date;
            const membershipEndDate =
              typeof membershipEndDateRaw === "object" &&
              membershipEndDateRaw !== null &&
              "toDate" in membershipEndDateRaw &&
              typeof (membershipEndDateRaw as { toDate: () => Date }).toDate === "function"
                ? (membershipEndDateRaw as { toDate: () => Date }).toDate()
                : new Date(membershipEndDateRaw as Date);

            const isActive = (endDate: Date) => new Date() < endDate;

            // Client must not mutate membership/role; server API handles this per security rules
            // We only compute and display state; updates occur via /api/membership/check-expired

            const membershipStartDateRaw = data.membershipStartDate as { toDate?: () => Date } | Date;
            const membershipStartDate =
              typeof membershipStartDateRaw === "object" &&
              membershipStartDateRaw !== null &&
              "toDate" in membershipStartDateRaw &&
              typeof (membershipStartDateRaw as { toDate: () => Date }).toDate === "function"
                ? (membershipStartDateRaw as { toDate: () => Date }).toDate()
                : new Date(membershipStartDateRaw as Date);

            const paymentDetailsRaw = data.paymentDetails as Record<string, unknown> | undefined;
            const paymentDateRaw = paymentDetailsRaw?.paymentDate as { toDate?: () => Date } | Date | undefined;
            const paymentDate = paymentDateRaw
              ? typeof paymentDateRaw === "object" &&
                paymentDateRaw !== null &&
                "toDate" in paymentDateRaw &&
                typeof (paymentDateRaw as { toDate: () => Date }).toDate === "function"
                ? (paymentDateRaw as { toDate: () => Date }).toDate()
                : new Date(paymentDateRaw as Date)
              : new Date();

            setMembershipData({
              membershipType: data.membershipType as string,
              membershipStartDate,
              membershipEndDate,
              paymentDetails: {
                razorpayOrderId: (paymentDetailsRaw?.razorpayOrderId as string) ?? "",
                razorpayPaymentId: (paymentDetailsRaw?.razorpayPaymentId as string) ?? "",
                amount: (paymentDetailsRaw?.amount as number) ?? 0,
                currency: (paymentDetailsRaw?.currency as string) ?? "INR",
                paymentDate,
              },
              role: isActive(membershipEndDate) ? (data.role as string) : "User",
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();

    if (user?.id) {
      // Call server API which uses Admin SDK to perform privileged updates
      fetch('/api/membership/check-expired', { method: 'POST' }).catch((error) => {
        console.error('Error triggering membership check:', error);
      });
    }
  }, [user?.id, user?.email]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen text-xl">
        <p>Please sign in to view your profile</p>
      </main>
    );
  }

  const displayName = (userData?.name as string) ?? user?.name ?? "Anonymous";
  const bio = (userData?.bio as string) ?? "No bio available";
  const branch = (userData?.branch as string) ?? "Not specified";
  const role = (userData?.role as string) ?? "User";
  const linkedin = (userData?.linkedin as string) ?? "/";
  const github = (userData?.github as string) ?? "";
  const githubUrl = github ? `https://github.com/${github}` : "/";

  const isActive = membershipData ? new Date() < membershipData.membershipEndDate : false;
  const statusMessage = membershipData
    ? isActive
      ? `Active ${membershipData.membershipType}.`
      : `Membership expired on ${membershipData.membershipEndDate.toLocaleDateString()}.`
    : "No membership found. Join CSI to become a member!";

  return (
    <main className="relative min-h-screen dark:from-gray-900 dark:via-gray-800 dark:to-black text-black dark:text-white">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-300/30 via-transparent to-transparent dark:from-indigo-900/20"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28">
        <Fade triggerOnce>
          <div className="rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-xl p-12 shadow-2xl ring-1 ring-gray-300/30 dark:ring-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-52 w-52 overflow-hidden rounded-full ring-8 ring-blue-500/30 shadow-2xl mb-6">
                <Image
                  src={user?.image?.replace("=s96-c", "") ?? "/favicon.ico"}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                {displayName}
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                @{displayName}
              </p>

              <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200 mb-6">
                {role}
              </span>

              {(env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" || membershipData) && (
                <div className="mt-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {membershipData ? (isActive ? "Active Member" : "Membership Expired") : "Not a Member"}
                      </h3>
                      <p className="text-sm text-gray-600">{statusMessage}</p>
                    </div>
                    <div className="flex gap-2">
                      {!membershipData && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                        <Link href="/recruit" className={buttonVariants({ variant: "default", size: "sm", className: "bg-blue-600 hover:bg-blue-700" })}>
                          Get Membership
                        </Link>
                      )}
                      {membershipData && !isActive && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                        <Link href="/recruit" className={buttonVariants({ variant: "default", size: "sm", className: "bg-orange-600 hover:bg-orange-700" })}>
                          Renew
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-base text-gray-700 dark:text-gray-300 w-full">
                <p>
                  <span className="font-semibold text-slate-500">Bio:</span>{" "}
                  {bio}
                </p>
                <p>
                  <span className="font-semibold text-slate-500">Branch:</span>{" "}
                  {branch}
                </p>
                {membershipData && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-semibold text-slate-500">Membership:</span>{" "}
                      {membershipData.membershipType}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-500">Period:</span>{" "}
                      {membershipData.membershipStartDate.toLocaleDateString()} - {membershipData.membershipEndDate.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-6">
                <Link
                  href={linkedin}
                  target="_blank"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className:
                      "rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition shadow-sm",
                  })}
                >
                  <LinkedinIcon size={26} />
                </Link>
                <Link
                  href={githubUrl}
                  target="_blank"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className:
                      "rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm",
                  })}
                >
                  <Github size={26} />
                </Link>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </main>
  );
}
