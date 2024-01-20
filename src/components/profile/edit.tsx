"use client"
import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from 'react-spinners'
import Link from 'next/link';
import AnimatedGradientText from '@/components/AnimatedGradientText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/app/_trpc/client';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

  // Loader component
  const Loader = () => (
    <div className="flex items-center justify-center h-screen">
      <RotateLoader color="#2563eb" />
    </div>
  );

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

const roleOptions = ["Artificial Intelligence & Data Science" ,"Artificial Intelligence & Machine Learning" ,"Biotechnology" ,"Civil Engineering" ,"Computer & Communication Engineering" ,"Computer Science & Engineering" ,"Computer Science (Full Stack Development)" ,"Computer Science (Cyber Security)" ,"Electrical & Electronics Engineering" ,"Electronics & Communication Engineering" ,"Electronics (VLSI Design & Technology)" ,"Electronics & Communication Engineering(ACT)" ,"Information Science & Engineering" ,"Mechanical Engineering" ,"Robotics & Artificial Intelligence"];


  interface ProfileProps {
    data: TabsProps;
  }
  
  interface TabsProps {
    name : string,
    username: string,
    pfp:  string,
    bio:  string,
    branch: string,
    github: string,
    linkedin: string,
    role: string,
    phonenumber: string,
  }

  const Edit:React.FC<ProfileProps> = ({data}) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name : data.name,
        username: data.username,
        bio:  data.bio,
        pfp:  data.pfp,
        branch: data.branch,
        github: data.github,
        linkedin: data.linkedin,
        phonenumber: data.phonenumber,  
       },
    });
    const [loading, setLoading] = useState(true);

    const router = useRouter();


    const addEventQuery = trpc.addMember.useMutation();

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
          console.log("Uploading");
    
          // Upload image to Firebase Storage and get the download URL
          const imageUrl = await uploadImageToStorage(image);
          form.setValue('pfp', imageUrl);
    
          console.log(form.getValues());
          toast("Profile has been updated", {
            description: `${values.name}'s profile updated.`,
          });
    
          router.push('/profile'); // Redirect to the profile page
        }
    
        await addEventQuery.mutate({
          name: values.name,
          username: values.username,
          bio: values.bio,
          branch: values.branch,
          github: values.github,
          linkedin: values.linkedin,
          phonenumber: values.phonenumber,
          pfp: form.getValues().pfp, // Use form.getValues().pfp directly
        });
    
        console.log('Done', values);
        router.push('/profile'); // Redirect to the profile page
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setUploading(false);
      }
    };
    

  
    return (
      <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-left">
                <Card>
          <CardHeader>
            <CardTitle>Edit your profile.</CardTitle>
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
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      defaultValue={data.name}
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
                      defaultValue={data.username}
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
                      defaultValue={data.bio}
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
                      defaultValue={data.phonenumber}
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
                      defaultValue={data.github}
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
                      defaultValue={data.linkedin}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </form>
            </Form>
          </CardContent>
          <CardFooter>
          <Button
              type="submit"
              style={{ padding: '10px' }}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </Button>
          </CardFooter>
        </Card>
      </MaxWidthWrapper>
    );
  };
  
  export default Edit;
  



