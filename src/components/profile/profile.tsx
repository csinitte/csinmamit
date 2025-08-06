import { LinkedinIcon, Github } from "lucide-react";
import { useAuth } from "~/lib/firebase-auth";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { buttonVariants } from "~/components/ui/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";
import { env } from "../../env";
import { checkAndUpdateExpiredMemberships } from "~/lib/membership-utils";

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
  csiIdNumber?: string; // Optional CSI ID number
}

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
  
  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as Record<string, unknown>;
          setUserData(data);
          
          // Check for membership data
          if (data.membershipType) {
            const membershipEndDateRaw = data.membershipEndDate as { toDate?: () => Date } | Date;
            const membershipEndDate = typeof membershipEndDateRaw === 'object' && membershipEndDateRaw !== null && 'toDate' in membershipEndDateRaw && typeof membershipEndDateRaw.toDate === 'function'
              ? membershipEndDateRaw.toDate() 
              : new Date(membershipEndDateRaw as Date);
            const isActive = isMembershipActive(membershipEndDate);
            
            // If membership has expired and user is still EXECUTIVE MEMBER, update their role
            if (!isActive && data.role === "EXECUTIVE MEMBER") {
              try {
                await updateDoc(doc(db, 'users', user.id), {
                  role: "User",
                  membershipExpired: true,
                  membershipExpiredDate: new Date(),
                  updatedAt: new Date(),
                });
                
                // Update local state to reflect the change
                setUserData(prev => ({ ...prev, role: "User" }));
              } catch (error) {
                console.error('Error updating expired membership role:', error);
              }
            }
            
            const membershipStartDateRaw = data.membershipStartDate as { toDate?: () => Date } | Date;
            const membershipStartDate = typeof membershipStartDateRaw === 'object' && membershipStartDateRaw !== null && 'toDate' in membershipStartDateRaw && typeof membershipStartDateRaw.toDate === 'function'
              ? membershipStartDateRaw.toDate() 
              : new Date(membershipStartDateRaw as Date);
            
            const paymentDetailsRaw = data.paymentDetails as Record<string, unknown> | undefined;
            const paymentDateRaw = paymentDetailsRaw?.paymentDate as { toDate?: () => Date } | Date | undefined;
            const paymentDate = paymentDateRaw 
              ? (typeof paymentDateRaw === 'object' && paymentDateRaw !== null && 'toDate' in paymentDateRaw && typeof paymentDateRaw.toDate === 'function'
                  ? paymentDateRaw.toDate() 
                  : new Date(paymentDateRaw as Date))
              : new Date();
            
            setMembershipData({
              membershipType: data.membershipType as string,
              membershipStartDate: membershipStartDate,
              membershipEndDate: membershipEndDate,
              paymentDetails: {
                razorpayOrderId: (paymentDetailsRaw?.razorpayOrderId as string) ?? '',
                razorpayPaymentId: (paymentDetailsRaw?.razorpayPaymentId as string) ?? '',
                amount: (paymentDetailsRaw?.amount as number) ?? 0,
                currency: (paymentDetailsRaw?.currency as string) ?? 'INR',
                paymentDate: paymentDate,
              },
              role: isActive ? (data.role as string) : "User",
            });
          }
        }


      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();
    
    // Check for expired memberships when profile loads
    if (user?.id) {
      // Run this in the background without blocking the UI
      checkAndUpdateExpiredMemberships().catch(error => {
        console.error('Error checking expired memberships:', error);
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
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isMembershipActive = (endDate: Date) => {
    const today = new Date();
    return today < endDate;
  };

  const getMembershipStatusMessage = (membershipData: MembershipData | null) => {
    if (!membershipData) {
      return "No membership found. Join CSI to become a member!";
    }
    
    const isActive = isMembershipActive(membershipData.membershipEndDate);
    if (isActive) {
      const daysRemaining = Math.ceil((membershipData.membershipEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return `Active ${membershipData.membershipType}. ${daysRemaining} days remaining.`;
    } else {
      return `Membership expired on ${membershipData.membershipEndDate.toLocaleDateString()}. Renew to continue benefits.`;
    }
  };

  const getMembershipBadgeColor = (membershipData: MembershipData | null) => {
    if (!membershipData) {
      return "bg-gray-100 text-gray-800";
    }
    
    const isActive = isMembershipActive(membershipData.membershipEndDate);
    if (isActive) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  const membershipStatusMessage = getMembershipStatusMessage(membershipData);
  const membershipBadgeColor = getMembershipBadgeColor(membershipData);

  return (
    <>
      <main>
        <section className="bg-white text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
          <div className="flex flex-col items-center justify-center text-center">
            <Fade triggerOnce cascade>
              <div>
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

                  <div>
                    <div className="mx-auto max-w-6xl lg:px-8">
                      <div className="mb-24 flow-root sm:mt-24">
                        <div className="-m-2   w-[45rem] overflow-hidden rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                          <h1 className="mb-5 text-2xl font-bold">
                            Your Profile
                          </h1>

                          <div className="rounded-mx relative mx-auto h-80 w-80 overflow-hidden pt-2 ">
                            <Image
                              src={
                                user?.image?.replace("=s96-c", "") ??
                                "/favicon.ico"
                              }
                              alt={user?.name ?? "img-av"}
                              height={200}
                              width={200}
                              priority={true}
                              className="h-full w-full rounded-md object-cover hover:border-cyan-300"
                            />
                          </div>

                          <div className="pt-3">
                            <h1
                              className={`bg-gradient-to-b from-blue-600 to-violet-400 bg-clip-text pb-4 text-center text-4xl font-black text-transparent`}
                            >
                              {(userData?.name as string) ?? user?.name}
                            </h1>
                          </div>
                          <div>
                            <h1>@{(userData?.name as string) ?? user?.name}</h1>
                          </div>

                          {/* Quick Membership Status Card - Only show when membership is enabled or user has active membership */}
                          {(env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" || (membershipData && isMembershipActive(membershipData.membershipEndDate))) && (
                            <div className="mt-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    membershipData && isMembershipActive(membershipData.membershipEndDate) 
                                      ? 'bg-green-500' 
                                      : membershipData 
                                      ? 'bg-red-500' 
                                      : 'bg-gray-400'
                                  }`}></div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {membershipData && isMembershipActive(membershipData.membershipEndDate) 
                                        ? 'Active Member' 
                                        : membershipData 
                                        ? 'Membership Expired' 
                                        : 'Not a Member'}
                                    </h3>
                                    <p className="text-sm text-gray-600">{membershipStatusMessage}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  {!membershipData && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                                    <Link
                                      href="/recruit"
                                      className={buttonVariants({
                                        variant: "default",
                                        size: "sm",
                                        className: "bg-blue-600 hover:bg-blue-700"
                                      })}
                                    >
                                      Get Membership
                                    </Link>
                                  )}
                                  {membershipData && !isMembershipActive(membershipData.membershipEndDate) && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                                    <Link
                                      href="/recruit"
                                      className={buttonVariants({
                                        variant: "default",
                                        size: "sm",
                                        className: "bg-orange-600 hover:bg-orange-700"
                                      })}
                                    >
                                      Renew
                                    </Link>
                                  )}
                                  {membershipData && isMembershipActive(membershipData.membershipEndDate) && (
                                    <div className="text-sm text-green-600 font-medium">
                                      Active Membership
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Membership Status Badge - Only show when membership is enabled or user has active membership */}
                          {(env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" || (membershipData && isMembershipActive(membershipData.membershipEndDate))) && (
                            <div className="mt-4 mb-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${membershipBadgeColor}`}>
                                {membershipStatusMessage}
                              </span>
                            </div>
                          )}

                          {/* Get Membership Section for Non-Members */}
                          {!membershipData && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                            <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                              <h3 className="text-lg font-semibold mb-3 text-blue-900">Join CSI NMAMIT</h3>
                              <p className="text-blue-700 mb-4">
                                Become an Executive Member of CSI NMAMIT and unlock exclusive benefits, workshops, events, and networking opportunities!
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-3 bg-white rounded-lg">
                                  <div className="text-2xl mb-2">🎯</div>
                                  <h4 className="font-semibold text-sm">Workshops</h4>
                                  <p className="text-xs text-gray-600">Technical & Soft Skills</p>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg">
                                  <div className="text-2xl mb-2">🤝</div>
                                  <h4 className="font-semibold text-sm">Networking</h4>
                                  <p className="text-xs text-gray-600">Industry Connections</p>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg">
                                  <div className="text-2xl mb-2">🏆</div>
                                  <h4 className="font-semibold text-sm">Events</h4>
                                  <p className="text-xs text-gray-600">Competitions & Fests</p>
                                </div>
                              </div>
                              <Link
                                href="/recruit"
                                className={buttonVariants({
                                  variant: "default",
                                  size: "lg",
                                  className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                })}
                              >
                                Get Executive Membership
                              </Link>
                            </div>
                          )}
                          
                          {/* Membership Disabled Message */}
                          {!membershipData && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED !== "true" && (
                            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                              <h3 className="text-lg font-semibold mb-3 text-gray-900">Membership Registration Closed</h3>
                              <p className="text-gray-700 mb-4">
                                Membership registration is currently closed. Please check back later for updates.
                              </p>
                            </div>
                          )}

                          {/* Renew Membership Section for Expired Members */}
                          {membershipData && !isMembershipActive(membershipData.membershipEndDate) && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
                            <div className="mb-6 p-6 bg-orange-50 rounded-lg border border-orange-200">
                              <h3 className="text-lg font-semibold mb-3 text-orange-900">Renew Your Membership</h3>
                              <p className="text-orange-700 mb-4">
                                Your membership has expired. Renew now to continue enjoying CSI NMAMIT benefits!
                              </p>
                              <Link
                                href="/recruit"
                                className={buttonVariants({
                                  variant: "default",
                                  size: "lg",
                                  className: "w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                                })}
                              >
                                Renew Membership
                              </Link>
                            </div>
                          )}
                          
                          {/* Expired Membership - Registration Closed */}
                          {membershipData && !isMembershipActive(membershipData.membershipEndDate) && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED !== "true" && (
                            <div className="mb-6 p-6 bg-red-50 rounded-lg border border-red-200">
                              <h3 className="text-lg font-semibold mb-3 text-red-900">Membership Expired</h3>
                              <p className="text-red-700 mb-4">
                                Your membership has expired and renewal is currently closed. Please check back later for updates.
                              </p>
                            </div>
                          )}

                          {/* Membership Details */}
                          {membershipData && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                              <h3 className="text-lg font-semibold mb-2">Membership Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Type:</strong> {membershipData.membershipType}</p>
                                  <p><strong>Start Date:</strong> {membershipData.membershipStartDate.toLocaleDateString()}</p>
                                  <p><strong>End Date:</strong> {membershipData.membershipEndDate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p><strong>Role:</strong> {membershipData.role}</p>
                                  <p><strong>Amount Paid:</strong> ₹{membershipData.paymentDetails?.amount || 0}</p>
                                  <p><strong>Payment Date:</strong> {
                                    (() => {
                                      const pd = membershipData.paymentDetails?.paymentDate;
                                      if (!pd) return 'N/A';
                                      if (pd instanceof Date) return pd.toLocaleDateString();
                                      if (typeof pd === 'object' && typeof pd.toDate === 'function') {
                                        const d = pd.toDate();
                                        if (d instanceof Date) return d.toLocaleDateString();
                                      }
                                      return 'N/A';
                                    })()
                                  }</p>
                                  {/* Show CSI ID Number if available */}
                                  {(userData?.csiIdNumber as string) && (
                                    <p><strong>CSI ID Number:</strong> <span className="font-mono text-blue-600">{userData?.csiIdNumber as string}</span></p>
                                  )}
                                </div>
                              </div>
                              {isMembershipActive(membershipData.membershipEndDate) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="text-sm text-green-600 font-medium">
                                    ✓ Active Membership - No renewal needed
                                  </div>
                                </div>
                              )}
                            </div>
                          )}



                          <h4>
                            <span className="font-bold text-slate-400">
                              Bio :{" "}
                            </span>
                            {(userData?.bio as string) ?? "No bio available"}
                          </h4>
                          <h4>
                            <span className="font-bold text-slate-400">
                              Branch :{" "}
                            </span>
                            {(userData?.branch as string) ?? "Not specified"}
                          </h4>
                          <h4>
                            <span className="font-bold text-slate-400">
                              Role:{" "}
                            </span>
                            {(userData?.role as string) ?? "User"}
                          </h4>
                          {/* CSI ID Number - Only show for Executive Members and Core Team */}
                          {((userData?.role as string) === "EXECUTIVE MEMBER" || 
                            (userData?.role as string) === "Core Team" || 
                            (userData?.role as string) === "Admin") && 
                            (userData?.csiIdNumber as string) && (
                            <h4>
                              <span className="font-bold text-slate-400">
                                CSI ID Number:{" "}
                              </span>
                              <span className="font-mono text-blue-600">
                                {userData?.csiIdNumber as string}
                              </span>
                            </h4>
                          )}
                          <div className="mt-4 flex justify-center gap-4">
                            <Link
                              className={buttonVariants({
                                variant: "outline",
                                size: "icon",
                                className:
                                  "rounded-full transition-colors hover:text-blue-500",
                              })}
                              href={(userData?.linkedin as string) ?? "/"}
                              target="_blank"
                            >
                              <LinkedinIcon size={24} />
                            </Link>
                            {(() => {
                              const githubUrl = (userData?.github as string) ?? "";
                              return (
                                <Link
                                  className={buttonVariants({
                                    variant: "outline",
                                    size: "icon",
                                    className:
                                      "rounded-full  transition-colors hover:text-gray-600",
                                  })}
                                  href={githubUrl ? `https://github.com/${githubUrl}` : "/"}
                                  target="_blank"
                                >
                                  <Github size={24} />
                                </Link>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
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
