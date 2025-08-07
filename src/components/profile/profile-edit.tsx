import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  BookText,
  LinkedinIcon,
  CircleUserRound,
  Phone,
  GitBranch,
  UserCheck,
  Loader2,
  Github
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useAuth } from "~/lib/firebase-auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const branches = [
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

export const EditProfile = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<{
    name: string;
    bio: string;
    branch: string;
    github: string;
    linkedin: string;
    phone: string;
    role: string;
    certificates: string[];
    // New fields for membership
    dateOfBirth: string;
    usn: string;
    yearOfStudy: string;
    personalEmail: string;
    collegeEmail: string;
    csiIdea: string;
    csiIdNumber: string; // New CSI ID number field
  }>({
    name: "",
    bio: "",
    branch: "",
    github: "",
    linkedin: "",
    phone: "",
    role: "User",
    certificates: [],
    // New fields with default values
    dateOfBirth: "",
    usn: "",
    yearOfStudy: "",
    personalEmail: "",
    collegeEmail: "",
    csiIdea: "",
    csiIdNumber: "", // Initialize CSI ID number
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
            github: (data.github as string) ?? "",
            linkedin: (data.linkedin as string) ?? "",
            phone: (data.phone as string) ?? "",
            role: (data.role as string) ?? "User",
            certificates: (data.certificates as string[]) ?? [],
            // Load new fields
            dateOfBirth: (data.dateOfBirth as string) ?? "",
            usn: (data.usn as string) ?? "",
            yearOfStudy: (data.yearOfStudy as string) ?? "",
            personalEmail: (data.personalEmail as string) ?? "",
            collegeEmail: (data.collegeEmail as string) ?? "",
            csiIdea: (data.csiIdea as string) ?? "",
            csiIdNumber: (data.csiIdNumber as string) ?? "",
          });
        } else {
          // For new users, initialize with default values
          setFormData({
            name: user?.name ?? "",
            bio: "",
            branch: "",
            github: "",
            linkedin: "",
            phone: "",
            role: "User",
            certificates: [],
            // New fields with default values
            dateOfBirth: "",
            usn: "",
            yearOfStudy: "",
            personalEmail: user?.email ?? "",
            collegeEmail: user?.email ?? "",
            csiIdea: "",
            csiIdNumber: "",
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error("Failed to load profile data", {
          description: "Please refresh the page and try again.",
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();
  }, [user?.id, user?.name, user?.email]);

  // Show loading state while authentication is being checked
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Check authentication after loading is complete
  if (!user) {
            void router.push("/");
    return null;
  }

  const onSubmit = async () => {
    try {
      if (!user.id) {
        toast.error("User not authenticated", {
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
        return;
      }

      // Validate form data before submission
      if (!formData.name.trim()) {
        toast.error("Name is required", {
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
        return;
      }

      // Validate personal email
      if (formData.personalEmail && !formData.personalEmail.includes('@')) {
        toast.error("Please enter a valid personal email address", {
          style: { backgroundColor: '#ef4444', color: 'white' }
        });
        return;
      }

      // Validate college email - must be a college domain
      if (formData.collegeEmail) {
        if (!formData.collegeEmail.includes('@')) {
          toast.error("Please enter a valid college email address", {
            style: { backgroundColor: '#ef4444', color: 'white' }
          });
          return;
        }
        
        const domain = formData.collegeEmail.split('@')[1]?.toLowerCase();
        if (!domain) {
          toast.error("Please enter a valid college email address", {
            style: { backgroundColor: '#ef4444', color: 'white' }
          });
          return;
        }
        
        const blockedDomains = [
          'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 
          'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
          'yandex.com', 'zoho.com', 'fastmail.com', 'tutanota.com',
          'gmial.com', 'gamil.com', 'gmai.com', 'gmal.com', // Common typos
          'outlok.com', 'outloook.com', 'hotmai.com', 'yhoo.com'
        ];
        
        if (blockedDomains.includes(domain)) {
          toast.error("Please use your college email address (e.g., @nmamit.in), not a personal email provider", {
            style: { backgroundColor: '#ef4444', color: 'white' }
          });
          return;
        }
      }

      // Clean GitHub username - remove any URL parts and extra spaces
      const cleanGithubUsername = formData.github.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

      setIsSubmitting(true);

      await setDoc(doc(db, 'users', user.id), {
        name: formData.name.trim(),
        bio: formData.bio.trim() || "",
        branch: formData.branch.trim() || "",
        github: cleanGithubUsername || "",
        linkedin: formData.linkedin.trim() || "",
        phone: formData.phone.trim() || "",
        role: formData.role,
        certificates: formData.certificates,
        // Save new fields
        dateOfBirth: formData.dateOfBirth.trim() || "",
        usn: formData.usn.trim() || "",
        yearOfStudy: formData.yearOfStudy || "",
        personalEmail: formData.personalEmail.trim() || "",
        collegeEmail: formData.collegeEmail.trim() || "",
        csiIdea: formData.csiIdea.trim() || "",
        csiIdNumber: formData.csiIdNumber.trim() || "",
        updatedAt: new Date(),
      }, { merge: true });

      toast.success("Profile updated successfully!", {
        description: `${formData.name}'s profile has been updated.`,
        style: { backgroundColor: '#10b981', color: 'white' }
      });
     
      void router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.", {
        style: { backgroundColor: '#ef4444', color: 'white' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}>
        <Card className="w-1/2 text-left mx-auto " suppressHydrationWarning>
          <CardContent className="p-4">
            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Name :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <CircleUserRound size={20} />
              </span>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                type="text"
                className="rounded-none rounded-r-lg"
                placeholder="Name"
                required
              />
            </div>

            {/* CSI ID Number - Only show for Executive Members and Core Team */}
            {(formData.role === "EXECUTIVE MEMBER" || formData.role === "Core Team" || formData.role === "Admin") && (
              <>
                <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
                  CSI ID Number :
                </p>
                <div className="flex">
                  <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                    <CircleUserRound size={20} />
                  </span>
                  <Input
                    id="csiIdNumber"
                    value={formData.csiIdNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        csiIdNumber: e.target.value.toUpperCase(),
                      })
                    }
                    type="text"
                    className="rounded-none rounded-r-lg"
                    placeholder="e.g., 2024001"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your unique CSI ID number for ID cards and official records
                </p>
              </>
            )}

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Phone number :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <Phone size={20} />
              </span>
              <Input
                type="number"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                maxLength={10}
                className="rounded-none rounded-r-lg"
              />
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Date of Birth (DD/MM/YYYY) :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <CircleUserRound size={20} />
              </span>
              <Input
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Format as DD/MM/YYYY
                  const numbers = value.replace(/\D/g, '');
                  let formatted = numbers;
                  if (numbers.length > 2) {
                    formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
                  }
                  if (numbers.length > 4) {
                    formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
                  }
                  setFormData({
                    ...formData,
                    dateOfBirth: formatted,
                  });
                }}
                type="text"
                className="rounded-none rounded-r-lg"
                placeholder="DD/MM/YYYY"
                maxLength={10}
              />
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              USN :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <CircleUserRound size={20} />
              </span>
              <Input
                id="usn"
                value={formData.usn}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usn: e.target.value.toUpperCase(),
                  })
                }
                type="text"
                className="rounded-none rounded-r-lg"
                placeholder="e.g., NNM24AC001"
              />
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Year of Study :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <CircleUserRound size={20} />
              </span>
              <select
                id="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yearOfStudy: e.target.value,
                  })
                }
                className="rounded-none rounded-r-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                aria-label="Select year of study"
              >
                <option value="">Select Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Bio :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <BookText size={20} />
              </span>
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                type="text"
                className="rounded-none rounded-r-lg"
                placeholder="Bio"
              />
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Branch :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <GitBranch size={20} />
              </span>
              <select
                id="branch"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    branch: e.target.value,
                  })
                }
                className="rounded-none rounded-r-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                aria-label="Select branch"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              GitHub :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <Github size={20} />
              </span>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    github: e.target.value.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, ''), // Remove URL parts if user pastes full URL
                  })
                }
                type="text"
                className="rounded-none rounded-r-lg"
                placeholder="Enter only username (e.g., johndoe)"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter only your GitHub username, not the full URL
            </p>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              LinkedIn :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <LinkedinIcon size={20} />
              </span>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    linkedin: e.target.value,
                  })
                }
                type="text"
                className="rounded-none rounded-r-lg"
                placeholder="LinkedIn Profile URL"
              />
            </div>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              Personal Email :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <CircleUserRound size={20} />
              </span>
              <Input
                id="personalEmail"
                value={formData.personalEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalEmail: e.target.value,
                  })
                }
                type="email"
                className="rounded-none rounded-r-lg"
                placeholder="your.email@gmail.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your personal email address for general communications
            </p>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              College Email :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <CircleUserRound size={20} />
              </span>
              <Input
                id="collegeEmail"
                value={formData.collegeEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    collegeEmail: e.target.value,
                  })
                }
                type="email"
                className="rounded-none rounded-r-lg"
                placeholder="your.usn@nmamit.in"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your college email address (e.g., @nmamit.in). Personal email providers are not allowed.
            </p>

            <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
              CSI Idea/Vision :
            </p>
            <div className="flex">
              <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                <BookText size={20} />
              </span>
              <textarea
                id="csiIdea"
                value={formData.csiIdea}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    csiIdea: e.target.value,
                  })
                }
                className="rounded-none rounded-r-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 w-full"
                placeholder="Share your ideas about CSI and what you hope to contribute..."
                rows={3}
              />
            </div>



            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};