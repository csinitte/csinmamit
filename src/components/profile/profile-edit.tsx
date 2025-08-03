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
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "~/lib/firebase-auth";

const branches = ["Artificial Intelligence & Data Science" ,"Artificial Intelligence & Machine Learning" ,"Biotechnology" ,"Civil Engineering" ,"Computer & Communication Engineering" ,"Computer Science & Engineering" ,"Computer Science (Full Stack Development)" ,"Computer Science (Cyber Security)" ,"Electrical & Electronics Engineering" ,"Electronics & Communication Engineering" ,"Electronics (VLSI Design & Technology)" ,"Electronics & Communication Engineering(ACT)" ,"Information Science & Engineering" ,"Mechanical Engineering" ,"Robotics & Artificial Intelligence"];

export const EditProfile = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    branch: "",
    github: "",
    linkedin: "",
    phone: "",
    role: "User", // Add role with default value "User"
    certificates: [], // Add certificates array
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
        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, 'users', user.id));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            branch: data.branch || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            phone: data.phone || "",
            role: data.role || "User", // Load role from Firestore
            certificates: data.certificates || [], // Load certificates from Firestore
          });
        } else {
          // For new users, initialize with default values including role
          setFormData({
            name: user?.name || "",
            bio: "",
            branch: "",
            github: "",
            linkedin: "",
            phone: "",
            role: "User", // Default role for new users
            certificates: [], // Default empty certificates array
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

    loadUserData();
  }, [user?.id]);

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
    router.push("/");
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

      // Clean GitHub username - remove any URL parts and extra spaces
      const cleanGithubUsername = formData.github.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

      setIsSubmitting(true);

      const db = getFirestore(app);
      await setDoc(doc(db, 'users', user.id), {
        name: formData.name.trim(),
        bio: formData.bio.trim() || "",
        branch: formData.branch.trim() || "",
        github: cleanGithubUsername || "",
        linkedin: formData.linkedin.trim() || "",
        phone: formData.phone.trim() || "",
        role: formData.role, // Include role in saved data
        certificates: formData.certificates, // Include certificates array
        updatedAt: new Date(),
      }, { merge: true });

      toast.success("Profile updated successfully!", {
        description: `${formData.name}'s profile has been updated.`,
        style: { backgroundColor: '#10b981', color: 'white' }
      });
     
      router.push('/profile')
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
        onSubmit();
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