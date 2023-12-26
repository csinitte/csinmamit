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
import MaxWidthWrapper from './MaxWidthWrapper';
import { storage } from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const isFileUrl = (value: string) => {
  // You can customize this logic based on how you identify a file URL
  return value.startsWith('file://');
};

const formSchema = z.object({
  name: z.string(),
  branch: z.string(),
  role: z.string(),
  linkedin: z.string().url({
    message: 'Please enter a valid LinkedIn profile URL.',
  }),
  github: z.string().url({
    message: 'Please enter a valid GitHub profile URL.',
  }),
  imageLink: z.string()
});

const AddTeam = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      branch: '',
      role: '',
      linkedin: '',
      github: '',
      imageLink: '',
    },
  });

  const addTeamQuery = trpc.addTeam.useMutation();
  const roleOptions = ["Chairman", "Vice Chairman", "Secretary", "Treasurer", "Joint Secretary", "Program Committee Head", "Program Committee Co-Head", "Social Media Head", "Web Editor Head", "Web Editor Co-Head", "MC Committee Head", "MC Committee Co-Head", "Graphic Committee Head", "Graphic Committee Co-Head", "Magazine Committee Head", "Magazine Committee Co-Head", "Photography Committee Head", "Photography Committee Co-Head", "Android Domain Head", "Android Domain Co-Head", "Web Domain Head", "Web Domain Co-Head", "AIML Domain Head", "AIML Domain Co-Head", "CyberSecurity Domain Head", "CyberSecurity Domain Co-Head", "Final Year Representative", "Third Year Representative", "Second Year Representative" ];

  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const imageRef = ref(storage, 'images/' + file.name);
  
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
        form.setValue('imageLink', imageUrl);
        
        console.log(form.getValues())
      }

      await addTeamQuery.mutate({
        name: values.name,
        branch: values.branch,
        role: values.role,
        linkedin: values.linkedin,
        github: values.github,
        imageLink: form.getValues('imageLink')
      });

      console.log('Done', values);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <MaxWidthWrapper>
      <div style={{ padding: '20px' }}>
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
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Branch"
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
              name="role"
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
                        Select Role
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
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter LinkedIn URL"
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
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter GitHub URL"
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
  name="imageLink"  // Update the name attribute to match the form schema
  render={({ field }) => (
    <FormItem>
      <FormLabel>Upload Image</FormLabel>
      <FormControl>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              handleImageChange(e);
            }}
          />
        </label>
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
      </div>
    </MaxWidthWrapper>
  );
};

export default AddTeam;