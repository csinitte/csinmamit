// Import necessary modules and components
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/app/_trpc/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { redirect } from 'next/navigation';
import AnimatedGradientText, { AnimatedGradientTexth3 } from '../AnimatedGradientText';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { storage } from '../../../firebase';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const formSchema = z.object({
    name : z.string(),
    username: z.string(),
    bio:  z.string(),
    pfp:  z.string(),
    phonenumber: z.string(),
    branch: z.string(),
    github: z.string(),
    linkedin: z.string(),
});


interface ProfileProps {
    username: string;
  }

const Edit:React.FC<ProfileProps> = ({username}) => {

    const { data: userData, error } = trpc.getProfile.useQuery({ username });
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name : userData?.name,
        username: userData?.username,
        bio:  userData?.bio || "",
        pfp:  userData?.pfp,
        branch: userData?.branch|| "",
        github: userData?.github|| "",
        linkedin: userData?.linkedin|| "",
        phonenumber: userData?.phonenumber|| "",
    },
  });
  const router = useRouter()

  const addEventQuery = trpc.addMember.useMutation();
  const roleOptions = ["Artificial Intelligence & Data Science" ,"Artificial Intelligence & Machine Learning" ,"Biotechnology" ,"Civil Engineering" ,"Computer & Communication Engineering" ,"Computer Science & Engineering" ,"Computer Science (Full Stack Development)" ,"Computer Science (Cyber Security)" ,"Electrical & Electronics Engineering" ,"Electronics & Communication Engineering" ,"Electronics (VLSI Design & Technology)" ,"Electronics & Communication Engineering(ACT)" ,"Information Science & Engineering" ,"Mechanical Engineering" ,"Robotics & Artificial Intelligence"];
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const imageRef = ref(storage, 'members/' + file.name);
  
    try {
      const snapshot = await uploadBytesResumable(imageRef, file);
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
  
      // Get download URL for the file
      const url = await getDownloadURL(snapshot.ref);
      console.log('File available at', url);
  
      // Return the download URL
      return url;
    } catch (error) {
      console.error('Upload failed', error);
      throw error; // Rethrow the error to handle it outside this function
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (image) {
        setUploading(true);

        // Upload image to Firebase Storage and get the download URL
        const imageUrl = await uploadImageToStorage(image);
        form.setValue('pfp', imageUrl);
        
        console.log(form.getValues())
        toast("User has been created", {
          description: `${values.name} entry created in the database.`,
        })
       
        router.push('/team')
        
      }

      await addEventQuery.mutate({
        name : values.name,
        username: values.username,
        bio:  values.bio,
        branch: values.branch,
        github: values.github,
        linkedin: values.linkedin,
        phonenumber: values.phonenumber, 
        pfp: form.getValues('pfp')
      });

      console.log('Done on god', values);
      redirect('/myprofile')
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <MaxWidthWrapper>
                <Card>
          <CardHeader>
            <CardTitle><AnimatedGradientTexth3>Edit your profile.</AnimatedGradientTexth3></CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when youre done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Form fields for name, branch, role, linkedin, github, imagelink */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Name"
                      {...field}
                      style={{ padding: '10px' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      defaultValue={userData?.username || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                                  <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bio"
                      {...field}
                      defaultValue={userData?.bio || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <FormField
          control={form.control}
          name="pfp"  // Update the name attribute to match the form schema
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      {...field}
                      defaultValue={userData?.phonenumber || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                        <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    {/* Dropdown for selecting role */}
                    <select
                      {...field}
                      style={{ padding: '10px', fontSize: '16px' }}
                    >
                      <option value="" disabled>
                        Select Branch
                      </option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Github Link"
                      {...field}
                      defaultValue={userData?.github || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                      <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="LinkedIn Link"
                      {...field}
                      defaultValue={userData?.linkedin|| ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              style={{ padding: '10px' }}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </Button>
          </form>
        </Form>
        </CardContent>
        </Card>
        
      
    </MaxWidthWrapper>
  );
};

export default Edit;