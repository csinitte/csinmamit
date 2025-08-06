// import { useState } from "react";
// import { Button } from "../ui/button";
// import { Card, CardContent } from "../ui/card";
// import { useForm, Controller } from "react-hook-form";
// import { toast } from "sonner";
// import { Input } from "../ui/input";
// import { api } from "~/utils/api";
// import { z } from "zod";
// import { useAuth } from "~/lib/firebase-auth";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";

// import { storage } from '../../../firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// const formSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   branch: z.string().min(1, "Branch is required"),
//   role: z.string().min(1, "Role is required"),
//   linkedin: z.string().url({
//     message: 'Please enter a valid LinkedIn profile URL.',
//   }),
//   github: z.string().url({
//     message: 'Please enter a valid GitHub profile URL.',
//   }),
//   imageLink: z.string().optional(),
// });

// const branches = ["Artificial Intelligence & Data Science", "Artificial Intelligence & Machine Learning", "Biotechnology", "Civil Engineering", "Computer & Communication Engineering", "Computer Science & Engineering", "Information Science & Engineering", "Mechanical Engineering"];
// const roleOptions = ["Chairman", "Vice Chairman", "Secretary", "Treasurer", "Joint Secretary", "Program Committee Head", "Program Committee Co-Head", "Social Media Head", "Web Editor Head", "Web Editor Co-Head", "MC Committee Head", "MC Committee Co-Head", "Graphic Committee Head", "Graphic Committee Co-Head", "Magazine Committee Head", "Magazine Committee Co-Head", "Photography Committee Head", "Photography Committee Co-Head", "Android Domain Head", "Android Domain Co-Head", "Web Domain Head", "Web Domain Co-Head", "AIML Domain Head", "AIML Domain Co-Head", "CyberSecurity Domain Head", "CyberSecurity Domain Co-Head", "Final Year Representative", "Third Year Representative", "Second Year Representative" ];

// import { zodResolver } from '@hookform/resolvers/zod';

// export const AddTeam = () => {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const userId = user?.id;
//   const email = user?.email ?? ""; // Ensure email is always a string

//   // All hooks must be called before any conditional returns
//   const userData = api.team.addTeam.useMutation();

//   const [image, setImage] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     getValues,
//   } = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       branch: "",
//       role: "",
//       linkedin: "",
//       github: "",
//       imageLink: "",
//     },
//   });

//   // Show loading state while authentication is being checked
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-sm text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Check authentication after loading is complete
//   if (!user) {
//     router.push("/");
//     return null;
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   const uploadImageToStorage = async (file: File): Promise<string> => {
//     const imageRef = ref(storage, 'images/' + file.name);
//     try {
//       const snapshot = await uploadBytesResumable(imageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       return url;
//     } catch (error) {
//       console.error('Upload failed', error);
//       throw error;
//     }
//   };

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       if (!userId) {
//         toast.error("User not authenticated", {
//           style: { backgroundColor: '#ef4444', color: 'white' }
//         });
//         return;
//       }

//       setIsSubmitting(true);

//       let imageUrl = getValues('imageLink') ?? ""; // Ensure imageLink is a string
//       if (image) {
//         setUploading(true);
//         imageUrl = await uploadImageToStorage(image); // Upload image and get the URL
//         setValue('imageLink', imageUrl); // Updating form value
//         setUploading(false);
//       }

//       await userData.mutateAsync({
//         userid: userId, // Corrected from 'custid'
//         email: email,
//         name: data.name,
//         role: data.role,
//         branch: data.branch,
//         github: data.github,
//         linkedin: data.linkedin,
//         imageLink: imageUrl,
//       });

//       toast.success("Team member added successfully!", {
//         description: `${data.name} has been added to the team.`,
//         style: { backgroundColor: '#10b981', color: 'white' }
//       });

//       router.push('/profile');
//     } catch (error) {
//       console.error('Error creating team:', error);
//       toast.error("Failed to add team member. Please try again.", {
//         style: { backgroundColor: '#ef4444', color: 'white' }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Card className="w-1/2 text-left mx-auto" suppressHydrationWarning>
//         <CardContent className="p-4">
//           {/* Name Field */}
//           <label htmlFor="name" className="mb-1 mt-3 block text-sm font-medium">
//             Name :
//           </label>
//           <Controller
//             name="name"
//             control={control}
//             render={({ field }) => (
//               <Input
//                 id="name"
//                 {...field}
//                 placeholder="Enter name"
//                 className="rounded-lg"
//               />
//             )}
//           />
//           {errors.name && <p className="text-red-500">{errors.name.message}</p>}

//           {/* Role Field */}
//           <label htmlFor="role" className="mb-1 mt-3 block text-sm font-medium">
//             Role :
//           </label>
//           <Controller
//             name="role"
//             control={control}
//             render={({ field }) => (
//               <select
//                 id="role"
//                 {...field}
//                 className="rounded-lg border-gray-300 px-4 py-2"
//               >
//                 <option value="" disabled>
//                   Select Role
//                 </option>
//                 {roleOptions.map((role) => (
//                   <option key={role} value={role}>
//                     {role}
//                   </option>
//                 ))}
//               </select>
//             )}
//           />
//           {errors.role && <p className="text-red-500">{errors.role.message}</p>}

//           {/* Branch Field */}
//           <label htmlFor="branch" className="mb-1 mt-3 block text-sm font-medium">
//             Branch :
//           </label>
//           <Controller
//             name="branch"
//             control={control}
//             render={({ field }) => (
//               <select
//                 id="branch"
//                 {...field}
//                 className="rounded-lg border-gray-300 px-4 py-2"
//               >
//                 <option value="" disabled>
//                   Select Branch
//                 </option>
//                 {branches.map((branch) => (
//                   <option key={branch} value={branch}>
//                     {branch}
//                   </option>
//                 ))}
//               </select>
//             )}
//           />
//           {errors.branch && <p className="text-red-500">{errors.branch.message}</p>}

//           {/* GitHub Field */}
//           <label htmlFor="github" className="mb-1 mt-3 block text-sm font-medium">
//             GitHub :
//           </label>
//           <Controller
//             name="github"
//             control={control}
//             render={({ field }) => (
//               <Input
//                 id="github"
//                 {...field}
//                 placeholder="Enter GitHub profile"
//                 className="rounded-lg"
//               />
//             )}
//           />
//           {errors.github && <p className="text-red-500">{errors.github.message}</p>}

//           {/* LinkedIn Field */}
//           <label htmlFor="linkedin" className="mb-1 mt-3 block text-sm font-medium">
//             LinkedIn :
//           </label>
//           <Controller
//             name="linkedin"
//             control={control}
//             render={({ field }) => (
//               <Input
//                 id="linkedin"
//                 {...field}
//                 placeholder="Enter LinkedIn profile"
//                 className="rounded-lg"
//               />
//             )}
//           />
//           {errors.linkedin && <p className="text-red-500">{errors.linkedin.message}</p>}

//           {/* Image Upload */}
//           <label htmlFor="imageUpload" className="mb-1 mt-3 block text-sm font-medium">
//             Upload Image:
//           </label>
//           <input 
//             id="imageUpload"
//             type="file" 
//             onChange={handleImageChange} 
//             className="rounded-lg"
//             accept="image/*"
//             aria-label="Upload profile image"
//           />
//           {errors.imageLink && <p className="text-red-500">{errors.imageLink.message}</p>}

//           <Button
//             onClick={handleSubmit(onSubmit)}
//             className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
//             disabled={uploading || isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               "Submit"
//             )}
//           </Button>
//         </CardContent>
//       </Card>
//     </>
//   );
// };
