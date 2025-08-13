import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BookText,
  LinkedinIcon,
  CircleUserRound,
  Phone,
  GitBranch,
  Loader2,
  Github,
  User,
  Save,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useAuth } from "~/lib/firebase-auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
const branches = [
  "Artificial Intelligence & Data Science",
  "Artificial Intelligence & Machine Learning",
  "Biotechnology",
  "Civil Engineering",
  "Computer & Communication Engineering",
  "Computer Science & Engineering",
  "Computer Science (Full Stack Development)",
  "Computer Science (Cyber Security)",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "Electronics (VLSI Design & Technology)",
  "Electronics & Communication Engineering(ACT)",
  "Information Science & Engineering",
  "Mechanical Engineering",
  "Robotics & Artificial Intelligence"
];

const InputField = ({ 
  label, 
  icon: Icon, 
  id, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  required = false,
  maxLength,
  helper 
}: {
  label: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  helper?: string;
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
      <Icon size={16} className="text-slate-500" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <Input
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
      />
    </div>
    {helper && (
      <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">{helper}</p>
    )}
  </div>
);

export const EditProfile = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<{
    name: string;
    bio: string;
    branch: string;
    usn: string; // <-- Add this line
    github: string;
    linkedin: string;
    phone: string;
    role: string;
    certificates: string[];
  }>({
    name: "",
    bio: "",
    branch: "",
    usn: "", // <-- Add this line
    github: "",
    linkedin: "",
    phone: "",
    role: "User",
    certificates: [],
  });
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          const data = userDoc.data();
          setFormData({
            name: (data.name as string) ?? "",
            bio: (data.bio as string) ?? "",
            branch: (data.branch as string) ?? "",
            usn: (data.usn as string) ?? "",
            github: (data.github as string) ?? "",
            linkedin: (data.linkedin as string) ?? "",
            phone: (data.phone as string) ?? "",
            role: (data.role as string) ?? "User",
            certificates: (data.certificates as string[]) ?? [],
          });
        } else {
          setFormData({
            name: user?.name ?? "",
            bio: "",
            branch: "",
            usn: "",
            github: "",
            linkedin: "",
            phone: "",
            role: "User",
            certificates: [],
          });
        }
      } catch {
        toast.error("Failed to load profile data", {
          description: "Please refresh the page and try again.",
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();
  }, [user?.id, user?.name]);

  // Show loading state while authentication is being checked
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 dark:border-slate-600"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Loading Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Please wait while we fetch your data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication after loading is complete
  if (!user?.id) {
    void router.push("/");
    return null;
  }

  const onSubmit = async () => {
    try {
      if (!user?.id) {
        toast.error("User not authenticated", {
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
        return;
      }

      if (!formData.name.trim()) {
        toast.error("Name is required", {
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
        return;
      }

      const cleanGithubUsername = formData.github.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

      // Prepare the data to be saved
      const userData = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || "",
        branch: formData.branch.trim() || "",
        usn: formData.usn.trim() || "",
        github: cleanGithubUsername || "",
        linkedin: formData.linkedin.trim() || "",
        phone: formData.phone.trim() || "",
      };

      setIsSubmitting(true);

      
      try {
        await setDoc(doc(db, 'users', user.id), userData, { merge: true });
      } catch (setDocError) {
        throw setDocError;
      }

      toast.success("Profile updated successfully!", {
        description: `${formData.name}'s profile has been updated.`,
        style: { backgroundColor: '#10b981', color: 'white' }
      });
     
      void router.push('/profile');
    } catch (error) {
      // Provide more specific error messages
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error instanceof Error) {
        const firebaseError = error as Error & { code?: string };
        
        if (error.message.includes('permission-denied') || firebaseError.code === 'permission-denied') {
          errorMessage = "Permission denied. Please check if you're logged in correctly and try again.";
        } else if (error.message.includes('unauthenticated') || firebaseError.code === 'unauthenticated') {
          errorMessage = "You need to be logged in to update your profile.";
        } else if (error.message.includes('invalid-argument') || firebaseError.code === 'invalid-argument') {
          errorMessage = "Invalid data provided. Please check your input.";
        } else if (error.message.includes('Missing or insufficient permissions')) {
          errorMessage = "Permission issue detected. Please refresh the page and try again.";
        }
      }
      
      toast.error(errorMessage, {
        style: { backgroundColor: '#ef4444', color: 'white' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="absolute left-4 top-8 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
          </div>
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User size={32} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Edit Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Update your personal information and preferences
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-center text-slate-800 dark:text-slate-200">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }} className="space-y-6">
              
              {/* Personal Details Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Basic Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    icon={CircleUserRound}
                    id="name"
                    value={formData.name ?? ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                  
                  <InputField
                    label="Phone Number"
                    icon={Phone}
                    id="phone"
                    value={formData.phone ?? ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    type="tel"
                    placeholder="Enter your phone number"
                    maxLength={15}
                  />
                </div>

                <InputField
                  label="Bio"
                  icon={BookText}
                  id="bio"
                  value={formData.bio ?? ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  helper="A brief description about yourself (optional)"
                />

                {/* Branch Selection */}
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <GitBranch size={16} className="text-slate-500" />
                    Branch/Department
                  </label>
                  <div className="relative group">
                    <select
                      id="branch"
                      value={formData.branch ?? ""}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 appearance-none cursor-pointer"
                    >
                      <option value="">Select your branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* USN Field */}
                <InputField
                  label="USN"
                  icon={CircleUserRound}
                  id="usn"
                  value={formData.usn ?? ""}
                  onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                  placeholder="NNM*******"
                  helper="Your University Seat Number (optional)"
                />
              </div>

              {/* Social Links Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Social Profiles
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="GitHub Username"
                    icon={Github}
                    id="github"
                    value={formData.github ?? ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      github: e.target.value.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
                    })}
                    placeholder="your-username"
                    helper="Enter only your GitHub username, not the full URL"
                  />
                  
                  <InputField
                    label="LinkedIn Profile"
                    icon={LinkedinIcon}
                    id="linkedin"
                    value={formData.linkedin ?? ""}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/your-profile"
                    helper="Full LinkedIn profile URL"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-6 py-3 border-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
