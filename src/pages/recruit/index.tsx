import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Fade } from "react-awesome-reveal";
import { toast, Toaster } from "sonner";
import { useAuth } from "~/lib/firebase-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { env } from "~/env";
import { useRouter } from "next/navigation";
import { CheckCircle, CreditCard, Crown, Loader2, Lock, XCircle } from "lucide-react";

// Public Razorpay Key ID (non-secret) hardcoded to avoid invalid config errors on client
const RAZORPAY_KEY_ID = "rzp_test_CfJA68nNVTLQg3";

const membershipPlans = [
  { id: "1-year", name: "1 Year", price: 350, years: 1 },
  { id: "2-year", name: "2 Years", price: 650, years: 2 },
  { id: "3-year", name: "3 Years", price: 900, years: 3 },
];

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void;
      prefill?: { name?: string; email?: string; contact?: string };
      theme?: { color?: string };
    }) => { open: () => void; on: (event: string, handler: (response: { error: { description?: string } }) => void) => void };
  }
}

export default function RecruitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0);
  const [selectedYears, setSelectedYears] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveMembership, setHasActiveMembership] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

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
          if (data.membershipEndDate) {
            const membershipEndDate = data.membershipEndDate as { toDate?: () => Date } | Date;
            const endDate =
              typeof membershipEndDate === "object" &&
              membershipEndDate !== null &&
              "toDate" in membershipEndDate &&
              typeof (membershipEndDate as { toDate: () => Date }).toDate === "function"
                ? (membershipEndDate as { toDate: () => Date }).toDate()
                : new Date(membershipEndDate as Date);
            const today = new Date();
            setHasActiveMembership(today < endDate);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadUserData();
  }, [user?.id]);

  const initiatePayment = async () => {
    if (!selectedPlanPrice || !user?.id) {
      setTimeout(() => toast.error("Please select a membership plan"), 0);
      return;
    }
    setIsProcessing(true);
    try {
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedPlanPrice, currency: "INR", receipt: `mem_${Date.now()}` }),
      });
      const orderData = (await orderResponse.json()) as { error?: string; amount: number; currency: string; orderId: string };
      if (!orderResponse.ok) throw new Error(orderData.error ?? "Failed to create order");

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CSI NMAMIT",
        description: `CSI Executive Membership - ${selectedPlan}`,
        order_id: orderData.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                userId: user.id,
                selectedYears,
                amount: selectedPlanPrice,
                userEmail: user.email,
                userName: user.name ?? (typeof userData?.name === 'string' ? userData.name : null),
                userUsn: typeof userData?.usn === 'string' ? userData.usn : null,
              }),
            });
            const verifyData = (await verifyResponse.json()) as { success: boolean };
            if (verifyData.success) {
              setTimeout(() => toast.success("Payment successful! Welcome email sent to your inbox. Updating your membership..."), 0);
              setIsSuccess(true);
              setTimeout(() => {
                window.location.href = "/profile";
              }, 3000);
            } else {
              setTimeout(() => toast.error("Payment verification failed. Please contact support."), 0);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setTimeout(() => toast.error("Payment verification failed. Please contact support."), 0);
          }
        },
        modal: {
          ondismiss: function () {
            setTimeout(() => toast.info("Payment was cancelled. You can try again later."), 0);
          },
        },
        prefill: {
          name: user.name ?? (typeof userData?.name === 'string' ? userData.name : "") ?? "",
          email: user.email ?? "",
          contact: (typeof userData?.phone === 'string' ? userData.phone : "") ?? "",
        },
        theme: { color: "#3B82F6" },
      } as unknown as ConstructorParameters<typeof window.Razorpay>[0];

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function (response: { error: { description?: string } }) {
        setTimeout(() => toast.error(`Payment failed: ${response.error.description ?? "Unknown error"}. Please try again.`), 0);
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      setTimeout(() => toast.error("Failed to initiate payment. Please try again."), 0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanSelection = (planName: string) => {
    const plan = membershipPlans.find((p) => p.name === planName);
    if (plan) {
      setSelectedPlan(plan.name);
      setSelectedPlanPrice(plan.price);
      setSelectedYears(plan.years);
    }
  };

  // Check if membership is enabled
  if (env.NEXT_PUBLIC_MEMBERSHIP_ENABLED !== "true") {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="text-center max-w-md mx-auto p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200 animate-fade-in">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" strokeWidth={2.5} />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Membership Registration Closed
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We’re not accepting new members right now. Please check back later for
          updates or announcements.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
    );
  }

  // Show loading state while checking authentication
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 animate-fade-in">
      <div className="flex flex-col items-center p-6 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" strokeWidth={2.5} />
        <p className="mt-3 text-sm text-gray-700 font-medium">Loading, please wait...</p>
      </div>
    </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    router.push("/");
    return (
       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="text-center max-w-md mx-auto p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200 animate-fade-in">
        <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" strokeWidth={2.5} />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Authentication Required
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You need to be logged in to access the membership registration page.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
    );
  }

  if (hasActiveMembership) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="text-center max-w-md mx-auto p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200 animate-fade-in">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" strokeWidth={2.5} />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Active Membership
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You already have an active membership. No renewal is needed at this time.
        </p>
        <Link
          href="/profile"
          className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
        >
          View Your Profile →
        </Link>
      </div>
    </div>
    );
  }



  return (
    <>
      <Head>
        <title>CSI NMAMIT - Executive Membership</title>
        <meta name="description" content="Join CSI NMAMIT Executive Membership" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12">
        <Fade triggerOnce cascade>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <div className="flex justify-between items-center mb-4">
                <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm">
                  ← Back to Profile
                </Link>
                <div className="text-sm text-gray-500">
                  Logged in as: {user.email}
                </div>
              </div>
              <h1 className="text-4xl font-black text-transparent sm:text-6xl bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text">
                CSI NMAMIT EXECUTIVE MEMBERSHIP
              </h1>
              <p className="mt-4 text-lg text-gray-600">Join the Computer Society of India (CSI) Executive Membership!</p>
            </div>

            {/* User Profile Information */}
            <Card className="mb-8 border border-green-200 bg-green-50/80 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-green-100 border-b border-green-200 px-6 py-4">
                <CardTitle className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  👤 Welcome, {(typeof userData?.name === 'string' ? userData.name : null) ?? user.name ?? "Member"}!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="">
                  <p className="text-sm text-green-700">
                    💡 <strong>Tip:</strong> Make sure your profile information is up to date.
                    <Link href="/profile" className="text-green-800 hover:text-green-900 underline ml-1">
                      Edit Profile
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border border-blue-100 shadow-xl rounded-xl overflow-hidden">
                  {/* Header with gradient */}
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Crown className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      Welcome to CSI NMAMIT
                    </CardTitle>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="space-y-6 p-6 bg-white">
                    <p className="text-gray-700 leading-relaxed text-base">
                      Choose your membership duration and get instant access to{" "}
                      <span className="font-medium text-blue-600">
                        exclusive benefits, networking opportunities
                      </span>
                      , and professional development resources.
                    </p>

                    {/* Membership Plans */}
                    <div className="rounded-lg bg-blue-50 border border-blue-100 p-5 shadow-sm">
                      <h3 className="font-semibold text-blue-800 mb-3 text-lg">
                        Membership Plans
                      </h3>
                      <ul className="space-y-2 text-blue-700">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          1-Year Executive Membership: ₹350
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          2-Year Executive Membership: ₹650
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          3-Year Executive Membership: ₹900
                        </li>
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg p-4 text-center font-medium shadow-md">
                      Join now and unlock your CSI benefits today!
                    </div>
                  </CardContent>
            </Card>

{isSuccess ? (
        <Card className="border-green-200 bg-green-50 shadow-lg rounded-xl animate-fade-in">
          <CardHeader className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
            <CardTitle className="text-xl font-semibold text-green-800">
              Membership Activated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700 leading-relaxed">
              🎉 Congratulations! You are now an <span className="font-semibold">Executive Member</span> of CSI NMAMIT.
              You will be redirected to your profile page shortly.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg rounded-xl animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-blue-700">
              Select Your Membership Duration
            </CardTitle>
            <p className="text-sm text-gray-600">
              Choose how long you want to be an Executive Member of CSI NMAMIT
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Membership Plan Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Choose your membership duration:{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={handlePlanSelection}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="Select membership duration" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name}>
                      {plan.name} — ₹{plan.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Plan Preview */}
            {selectedPlan && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                <h3 className="font-semibold text-blue-800 mb-1">Selected Plan:</h3>
                <p className="text-blue-700">
                  {selectedPlan} Executive Membership — ₹{selectedPlanPrice}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Duration: {selectedYears} year{selectedYears > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Payment Button */}
            <div className="pt-2">
              <Button
                onClick={initiatePayment}
                disabled={!selectedPlan || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay ₹{selectedPlanPrice} & Get Executive Membership
                  </>
                )}
              </Button>
            </div>

            {/* Info Note */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>You will be redirected to a secure payment gateway</p>
              <p>After successful payment, your membership will be activated immediately</p>
              <p className="mt-2 text-xs text-blue-600">
                💡 A welcome email will be sent to your inbox after successful payment
              </p>
            </div>
          </CardContent>
        </Card>
      )}
          </div>
        </Fade>
      </MaxWidthWrapper>

      <Toaster position="top-right" richColors closeButton duration={4000} />
    </>
  );
}


