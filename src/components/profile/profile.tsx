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

  const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between text-gray-700 dark:text-gray-300">
      <span className="font-semibold text-slate-500">{label}:</span>
      <span>{value}</span>
    </div>
  );


  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        
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
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserData();

    if (user?.id) {
      // Call server API which uses Admin SDK to perform privileged updates
      fetch('/api/membership/check-expired', { method: 'POST' }).catch((error) => {
        console.error('Error triggering membership check:', error);
      });
    }
  }, [user?.id, user?.email]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen text-xl p-4">
        <p>Please sign in to view your profile</p>
      </main>
    );
  }

  const displayName = (userData?.name as string) ?? user?.name ?? "Anonymous";
  const bio = (userData?.bio as string) ?? "No bio available";
  const branch = (userData?.branch as string) ?? "Not specified";
  const role = (userData?.role as string) ?? "User";
  const githubUsername =
    typeof userData?.github === "string" ? userData.github : "";

  const isActive = membershipData ? new Date() < membershipData.membershipEndDate : false;
  const statusMessage = membershipData
    ? isActive
      ? `Active ${membershipData.membershipType}.`
      : `Membership expired on ${membershipData.membershipEndDate.toLocaleDateString()}.`
    : "No membership found. Join CSI to become a member!";

  return (
    <>
      <main className="min-h-screen">
        <section className="bg-white text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <Fade triggerOnce cascade>
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative isolate">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                  >
                    <div
                      style={{
                        clipPath:
                          "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                      }}
                      className="relative-left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
                    ></div>
                  </div>
<div className="max-w-6xl mx-auto px-4">
  <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 
                  p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-10">

    {/* LEFT PANEL */}
    <div className="flex flex-col items-center lg:items-start gap-6 lg:w-1/3">
      {/* Profile Image */}
      <div className="relative h-40 w-40 rounded-full overflow-hidden ring-4 ring-blue-500/50 shadow-xl hover:scale-105 transition-transform">
        <Image
          src={user?.image?.replace("=s96-c", "") ?? "/favicon.ico"}
          alt={user?.name ?? "Profile"}
          fill
          className="object-cover"
        />
      </div>

      {/* Name & Role */}
      <div className="text-center lg:text-left space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {displayName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">@{displayName}</p>
        <span className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 text-sm font-medium shadow-md">
          {role}
        </span>
      </div>

      {/* Social Links */}
      <div className="flex gap-3">
        <Link className="rounded-full p-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          href={userData?.linkedin ?? "/"} target="_blank">
          <LinkedinIcon size={20} />
        </Link>
        <Link
          className="rounded-full p-3 bg-gray-800 text-white hover:bg-black transition-colors"
          href={githubUsername ? `https://github.com/${githubUsername}` : "/"}
          target="_blank"
        >
          <Github size={20} />
        </Link>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 space-y-6">

      {/* Membership Status */}
      {(env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" || membershipData) && (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-200/50 shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {membershipData
                  ? isActive
                    ? "✅ Active Member"
                    : "⚠️ Membership Expired"
                  : "Not a Member"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{statusMessage}</p>
            </div>
            <div className="flex gap-2">
              {!membershipData && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                <Link href="/recruit" className={buttonVariants({ variant: "default", size: "sm", className: "bg-blue-600 hover:bg-blue-700" })}>
                  Get Membership
                </Link>
              )}
              {membershipData && !isActive && (
                <Link href="/recruit" className={buttonVariants({ variant: "default", size: "sm", className: "bg-orange-600 hover:bg-orange-700" })}>
                  Renew
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Info Card */}
      <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200/30 shadow-sm space-y-2">
        <h4 className="font-semibold text-slate-600 dark:text-gray-300">Profile Information</h4>
        <InfoRow label="Bio" value={bio} />
        <InfoRow label="Branch" value={branch} />
        <InfoRow label="Role" value={role} />
      </div>

      {/* Membership Details */}
      {membershipData && (
        <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200/30 shadow-sm space-y-2">
          <h4 className="font-semibold text-slate-600 dark:text-gray-300">Membership Details</h4>
          <InfoRow label="Type" value={membershipData.membershipType} />
          <InfoRow label="Period" value={`${membershipData.membershipStartDate.toLocaleDateString()} - ${membershipData.membershipEndDate.toLocaleDateString()}`} />
          <InfoRow label="Amount" value={`₹${membershipData.paymentDetails.amount} ${membershipData.paymentDetails.currency}`} />
          <InfoRow label="Payment Date" value={
            membershipData.paymentDetails.paymentDate instanceof Date
              ? membershipData.paymentDetails.paymentDate.toLocaleDateString()
              : membershipData.paymentDetails.paymentDate.toDate().toLocaleDateString()
          } />
        </div>
      )}
    </div>
  </div>
</div>


                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                  >
                    <div
                      style={{
                        clipPath:
                          "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                      }}
                      className="relative-left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
                    ></div>
                  </div>
                </div>
              </div>
            </Fade>
          </div>
        </section>
      </main>
    </>
  );
}
