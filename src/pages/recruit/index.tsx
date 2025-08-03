import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Fade } from "react-awesome-reveal";
import localFont from "next/font/local";
import { api } from "~/utils/api";
import { toast, Toaster } from "sonner";

const myFont = localFont({ src: "../../pages/obscura.otf" });

// Form validation schema
const recruitFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Please use DD/MM/YYYY format")
    .refine((date) => {
      const parts = date.split('/').map(Number);
      const [day, month, year] = parts;
      
      // Check if all parts are valid numbers
      if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
        return false;
      }
      
      const dateObj = new Date(year, month - 1, day);
      return dateObj.getDate() === day && 
             dateObj.getMonth() === month - 1 && 
             dateObj.getFullYear() === year &&
             year >= 1900 && year <= new Date().getFullYear();
    }, "Please enter a valid date"),
  usn: z.string().min(1, "USN is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  branch: z.string().min(1, "Branch is required"),
  mobileNumber: z.string().min(10, "Valid mobile number is required"),
  personalEmail: z.string().email("Valid email is required"),
  collegeEmail: z.string()
    .optional()
    .refine((email) => {
      if (!email) return true; // Optional field
      if (!email.includes('@')) return false; // Basic email format check
      const domain = email.split('@')[1]?.toLowerCase();
      if (!domain) return false; // Check if domain exists
      const blockedDomains = [
        'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 
        'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
        'yandex.com', 'zoho.com', 'fastmail.com', 'tutanota.com',
        'gmial.com', 'gamil.com', 'gmai.com', 'gmal.com', // Common typos
        'outlok.com', 'outloook.com', 'hotmai.com', 'yhoo.com'
      ];
      return !blockedDomains.includes(domain);
    }, "Please use your college email address (e.g., @nmamit.in), not a personal email provider"),
  membershipPlan: z.string().min(1, "Please select a membership plan"),
  csiIdea: z.string().min(1, "Please share your idea about CSI"),
});

type RecruitFormData = z.infer<typeof recruitFormSchema>;

const branchOptions = [
  "Artificial Intelligence & Data Science",
  "Artificial Intelligence & Machine Learning Engineering",
  "Biotechnology Engineering",
  "Civil Engineering",
  "Computer & Communication Engineering",
  "Computer Science & Engineering",
  "Computer Science & Engineering (Cyber Security)",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "Electronics Engineering (VLSI Design & Technology)",
  "Electronics & Communication (Advanced Communication Technology)",
  "Information Science & Engineering",
  "Mechanical Engineering",
  "Robotics & Artificial Intelligence Engineering",
  "MCA",
];

const yearOptions = ["1st", "2nd", "3rd", "4th"];

const membershipPlans = [
  { id: "1-year", name: "1-Year Membership: ₹350", price: 350 },
  { id: "2-year", name: "2-Year Membership: ₹650", price: 650 },
  { id: "3-year", name: "3-Year Membership: ₹900", price: 900 },
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Function to format date input
  const formatDateInput = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Add slashes at appropriate positions
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2);
    } else {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RecruitFormData>({
    resolver: zodResolver(recruitFormSchema),
  });

  const submitRecruitMutation = api.recruit.submitRecruitForm.useMutation({
    onSuccess: (recruit) => {
      // After successful form submission, initiate payment
      if (recruit.recruit.id) {
        void initiatePayment(recruit.recruit.id);
      } else {
        toast.error("Error: Recruit ID not found");
      }
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    },
  });

  const initiatePayment = async (recruitId: string) => {
    if (!selectedPlanPrice) {
      toast.error("Please select a membership plan");
      return;
    }

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
          receipt: `recruit_${recruitId}`,
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
        key: 'rzp_test_CfJA68nNVTLQg3', // Your new key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CSI NMAMIT',
        description: `CSI Membership - ${selectedPlan}`,
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
              toast.success('Payment successful! Welcome to CSI NMAMIT! 🎉 Check your email for confirmation.');
              setIsSuccess(true);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed by user');
            toast.info('Payment was cancelled. You can try again later.');
          }
        },
        prefill: {
          name: watch('name'),
          email: watch('personalEmail'),
          contact: watch('mobileNumber'),
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
        toast.error(`Payment failed: ${response.error.description ?? 'Unknown error'}. Please try again.`);
      });
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  const onSubmit = async (data: RecruitFormData) => {
    setIsSubmitting(true);
    try {
      await submitRecruitMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Join the Computer Society of India (CSI) Membership!
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
                  Welcome to the registration form for becoming an official member of the Computer Society of India (CSI) through our Student Branch at NMAMIT. By filling out this form, you&apos;ll gain access to various benefits and networking opportunities within the tech community.
                </p>
                
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Membership Fees:</h3>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 1-Year Membership: ₹350</li>
                    <li>• 2-Year Membership: ₹650</li>
                    <li>• 3-Year Membership: ₹900</li>
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
                    🎉 Registration Successful!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-700">
                    Congratulations! You have successfully joined CSI NMAMIT. 
                    Please check your email for confirmation and welcome details.
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSuccess(false);
                      window.location.reload();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Register Another Member
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Registration Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Membership Registration Form
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Fill out this form to secure your membership and become part of a vibrant professional network!
                    </p>
                  </CardHeader>
                  <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="text"
                      {...register("dateOfBirth")}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      onChange={(e) => {
                        const formatted = formatDateInput(e.target.value);
                        e.target.value = formatted;
                        setValue("dateOfBirth", formatted);
                      }}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  {/* USN */}
                  <div className="space-y-2">
                    <Label htmlFor="usn" className="text-sm font-medium">
                      USN <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="usn"
                      {...register("usn")}
                      placeholder="Enter your USN"
                      className={errors.usn ? "border-red-500" : ""}
                    />
                    {errors.usn && (
                      <p className="text-sm text-red-500">{errors.usn.message}</p>
                    )}
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-2">
                    <Label htmlFor="yearOfStudy" className="text-sm font-medium">
                      Year of Study <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("yearOfStudy", value)}>
                      <SelectTrigger className={errors.yearOfStudy ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your year of study" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.yearOfStudy && (
                      <p className="text-sm text-red-500">{errors.yearOfStudy.message}</p>
                    )}
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-sm font-medium">
                      Branch <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("branch", value)}>
                      <SelectTrigger className={errors.branch ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branchOptions.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.branch && (
                      <p className="text-sm text-red-500">{errors.branch.message}</p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber" className="text-sm font-medium">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNumber"
                      {...register("mobileNumber")}
                      placeholder="Enter your mobile number"
                      className={errors.mobileNumber ? "border-red-500" : ""}
                    />
                    {errors.mobileNumber && (
                      <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>
                    )}
                  </div>

                  {/* Personal Email */}
                  <div className="space-y-2">
                    <Label htmlFor="personalEmail" className="text-sm font-medium">
                      Personal Email ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="personalEmail"
                      type="email"
                      {...register("personalEmail")}
                      placeholder="Enter your personal email"
                      className={errors.personalEmail ? "border-red-500" : ""}
                    />
                    {errors.personalEmail && (
                      <p className="text-sm text-red-500">{errors.personalEmail.message}</p>
                    )}
                  </div>

                  {/* College Email */}
                  <div className="space-y-2">
                    <Label htmlFor="collegeEmail" className="text-sm font-medium">
                      College Email ID (if available)
                    </Label>
                    <Input
                      id="collegeEmail"
                      type="email"
                      {...register("collegeEmail")}
                      placeholder="Enter your college email (optional)"
                      className={errors.collegeEmail ? "border-red-500" : ""}
                    />
                    {errors.collegeEmail && (
                      <p className="text-sm text-red-500">{errors.collegeEmail.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Example: yourname@nmamit.in (Personal email providers like Gmail, Outlook are not allowed)
                    </p>
                  </div>

                  {/* Membership Plan */}
                  <div className="space-y-2">
                    <Label htmlFor="membershipPlan" className="text-sm font-medium">
                      Choose your preferred CSI membership plan: <span className="text-red-500">*</span>
                    </Label>
                                         <Select onValueChange={(value) => {
                       setValue("membershipPlan", value);
                       const plan = membershipPlans.find(p => p.name === value);
                       setSelectedPlan(value);
                       setSelectedPlanPrice(plan?.price ?? 0);
                     }}>
                       <SelectTrigger className={errors.membershipPlan ? "border-red-500" : ""}>
                         <SelectValue placeholder="Select membership plan" />
                       </SelectTrigger>
                       <SelectContent>
                         {membershipPlans.map((plan) => (
                           <SelectItem key={plan.id} value={plan.name}>
                             {plan.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                    {errors.membershipPlan && (
                      <p className="text-sm text-red-500">{errors.membershipPlan.message}</p>
                    )}
                  </div>

                  {/* CSI Idea */}
                  <div className="space-y-2">
                    <Label htmlFor="csiIdea" className="text-sm font-medium">
                      What idea do you currently have about CSI? <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="csiIdea"
                      {...register("csiIdea")}
                      placeholder="Share your thoughts about CSI..."
                      rows={4}
                      className={errors.csiIdea ? "border-red-500" : ""}
                    />
                    {errors.csiIdea && (
                      <p className="text-sm text-red-500">{errors.csiIdea.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </div>
                </form>
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