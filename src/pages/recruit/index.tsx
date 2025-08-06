import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Fade } from "react-awesome-reveal";
import localFont from "next/font/local";
import { toast, Toaster } from "sonner";
import { useAuth } from "~/lib/firebase-auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { env } from "../../env";

const myFont = localFont({ src: "../../pages/obscura.otf" });

// Membership plans with simplified pricing
const membershipPlans = [
  { id: "1-year", name: "1 Year", price: 350, years: 1 },
  { id: "2-year", name: "2 Years", price: 650, years: 2 },
  { id: "3-year", name: "3 Years", price: 900, years: 3 },
];

// Add Razorpay script
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
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      theme?: {
        color?: string;
      };
    }) => {
      open: () => void;
      on(event: string, handler: (response: { error: { description?: string } }) => void): void;
    };
  }
}

export default function RecruitPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0);
  const [selectedYears, setSelectedYears] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveMembership, setHasActiveMembership] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Load user data
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
          
          // Check if user has active membership
          if (data.membershipEndDate) {
            const membershipEndDate = data.membershipEndDate as { toDate?: () => Date } | Date;
            const endDate = typeof membershipEndDate === 'object' && membershipEndDate !== null && 'toDate' in membershipEndDate && typeof membershipEndDate.toDate === 'function'
              ? membershipEndDate.toDate() 
              : new Date(membershipEndDate as Date);
            const today = new Date();
            setHasActiveMembership(today < endDate);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();
  }, [user?.id]);



  const initiatePayment = async () => {
    if (!selectedPlanPrice || !user?.id) {
      setTimeout(() => {
        toast.error("Please select a membership plan");
      }, 0);
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlanPrice,
          currency: 'INR',
          receipt: `mem_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json() as {
        error?: string;
        amount: number;
        currency: string;
        orderId: string;
      };

      if (!orderResponse.ok) {
        throw new Error(orderData.error ?? 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_CfJA68nNVTLQg3',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CSI NMAMIT',
        description: `CSI Executive Membership - ${selectedPlan}`,
        order_id: orderData.orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json() as {
              success: boolean;
            };

            if (verifyData.success) {
              // Update user membership after successful payment
              try {
                const membershipStartDate = new Date();
                const membershipEndDate = new Date();
                
                // Set end date to April 30th of the respective year
                const currentYear = new Date().getFullYear();
                const endYear = currentYear + selectedYears;
                membershipEndDate.setFullYear(endYear);
                membershipEndDate.setMonth(3); // April (0-indexed)
                membershipEndDate.setDate(30);
                
                // If we're past April 30th of current year, start from next year
                const currentDate = new Date();
                if (currentDate.getMonth() > 3 || (currentDate.getMonth() === 3 && currentDate.getDate() > 30)) {
                  membershipEndDate.setFullYear(endYear + 1);
                }

                // Update user document with membership data
                const userRef = doc(db, 'users', user.id);
                const membershipData = {
                  membershipType: `${selectedYears}-Year Executive Membership (Until ${membershipEndDate.getFullYear()})`,
                  membershipStartDate: membershipStartDate,
                  membershipEndDate: membershipEndDate,
                  paymentDetails: {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    amount: selectedPlanPrice, // Use the original price in rupees, not paise
                    currency: orderData.currency,
                    paymentDate: new Date(),
                  },
                  role: "EXECUTIVE MEMBER",
                  updatedAt: new Date(),
                };

                // Check if user document exists, if not create it
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                  // Update existing user document with membership data
                  await updateDoc(userRef, membershipData);
                } else {
                  // Create new user document with membership data
                  await setDoc(userRef, {
                    ...membershipData,
                    name: user.name ?? (userData?.name as string) ?? 'CSI Member',
                    email: user.email,
                    createdAt: new Date(),
                  });
                }

                setTimeout(() => {
                  toast.success('Payment successful! Updating your membership...');
                }, 0);
                setIsSuccess(true);
                
                // Redirect to profile after a short delay
                setTimeout(() => {
                  window.location.href = "/profile";
                }, 2000);

              } catch (error) {
                console.error('Error updating user membership:', error);
                setTimeout(() => {
                  toast.error('Payment successful but failed to update membership. Please contact support.');
                }, 0);
              }
                          } else {
                setTimeout(() => {
                  toast.error('Payment verification failed. Please contact support.');
                }, 0);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              setTimeout(() => {
                toast.error('Payment verification failed. Please contact support.');
              }, 0);
            }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed by user');
            setTimeout(() => {
              toast.info('Payment was cancelled. You can try again later.');
            }, 0);
          }
        },
        prefill: {
          name: user.name ?? (userData?.name as string) ?? '',
          email: user.email ?? '',
          contact: (userData?.phone as string) ?? '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Handle payment failures
      razorpay.on('payment.failed', function (response: { error: { description?: string } }) {
        console.error('Payment failed:', response.error);
        setTimeout(() => {
          toast.error(`Payment failed: ${response.error.description ?? 'Unknown error'}. Please try again.`);
        }, 0);
      });
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setTimeout(() => {
        toast.error('Failed to initiate payment. Please try again.');
      }, 0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanSelection = (planName: string) => {
    const plan = membershipPlans.find(p => p.name === planName);
    if (plan) {
      setSelectedPlan(plan.name);
      setSelectedPlanPrice(plan.price);
      setSelectedYears(plan.years);
    }
  };

  // Check if membership is enabled
  if (env.NEXT_PUBLIC_MEMBERSHIP_ENABLED !== "true") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Membership Registration Closed</h1>
          <p className="text-gray-600 mb-6">
            Membership registration is currently closed. Please check back later for updates.
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has active membership
  if (hasActiveMembership) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Active Membership</h1>
          <p className="text-gray-600 mb-6">
            You already have an active membership. No renewal is needed at this time.
          </p>
          <Link href="/profile" className="text-blue-600 hover:text-blue-700">
            View Your Profile
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
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
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className={`${myFont.className} bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text text-4xl font-black text-transparent sm:text-6xl`}>
                CSI NMAMIT EXECUTIVE MEMBERSHIP
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Join the Computer Society of India (CSI) Executive Membership!
              </p>
            </div>

            {/* Welcome Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  Welcome to CSI NMAMIT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Welcome to the Computer Society of India (CSI) Executive Membership at NMAMIT. 
                  Choose your membership duration and get instant access to exclusive benefits, 
                  networking opportunities, and professional development resources.
                </p>
                
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Membership Plans:</h3>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 1-Year Executive Membership: ₹350</li>
                    <li>• 2-Year Executive Membership: ₹650</li>
                    <li>• 3-Year Executive Membership: ₹900</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="font-semibold text-green-800 mb-2">For any queries, please contact:</h3>
                  <ul className="space-y-1 text-green-700">
                    <li>• Takshak Shetty: 9819432031</li>
                    <li>• Harshitha P Salian: 8431748027</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Success Message */}
            {isSuccess ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-800">
                    🎉 Membership Activated Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-700">
                    Congratulations! You are now an Executive Member of CSI NMAMIT. 
                    You will be redirected to your profile page shortly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Membership Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Select Your Membership Duration
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Choose how long you want to be an Executive Member of CSI NMAMIT
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Membership Plan Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Choose your membership duration: <span className="text-red-500">*</span>
                      </label>
                      <Select onValueChange={handlePlanSelection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {membershipPlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>
                              {plan.name} - ₹{plan.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Selected Plan Display */}
                    {selectedPlan && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">Selected Plan:</h3>
                        <p className="text-blue-700">
                          {selectedPlan} Executive Membership - ₹{selectedPlanPrice}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          Duration: {selectedYears} year{selectedYears > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    {/* Payment Button */}
                    <div className="pt-4">
                      <Button
                        onClick={initiatePayment}
                        disabled={!selectedPlan || isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {isProcessing ? "Processing..." : `Pay ₹${selectedPlanPrice} & Get Executive Membership`}
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="text-center text-sm text-gray-500">
                      <p>You will be redirected to a secure payment gateway</p>
                      <p>After successful payment, your membership will be activated immediately</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </Fade>
      </MaxWidthWrapper>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </>
  );
} 