// Import necessary modules and components
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'sonner';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { storage } from '../../../firebase';
import { AnimatedGradientTexth2 } from '../AnimatedGradientText';

const formSchema = z.object({
  userId: z.string(), // Remove userId from props and add it to the form schema
  certificateName: z.string(),
  certificateLink: z.string().url({
    message: 'Please enter a valid URL.',
  }),
});

const UploadCertificate: React.FC = () => {
  const userId = ''; // Set userId here or fetch it from your authentication context

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      certificateName: '',
      certificateLink: '',
    },
  });

  const router = useRouter();

  const addCertificateQuery = trpc.addCertificate.useMutation();

  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      uploadCertificate(file)
        .then((url) => {
          form.setValue('certificateLink', url);
        })
        .catch((error) => {
          console.error('Error uploading certificate:', error);
          toast.error('Error uploading certificate');
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const uploadCertificate = async (file: File): Promise<string> => {
    const certificateRef = ref(storage, 'certificates/' + file.name);

    try {
      const snapshot = await uploadBytesResumable(certificateRef, file);
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
      await addCertificateQuery.mutate({
        certificateName: values.certificateName,
        certificateLink: values.certificateLink,
        userId: values.userId,
      });

      toast.success('Certificate uploaded successfully');
      console.log(values)
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('Error uploading certificate');
    }
  };

  return (
    <MaxWidthWrapper>
      <AnimatedGradientTexth2>Certificate</AnimatedGradientTexth2>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ padding: '20px' }}>
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter User ID:</FormLabel>
                <Input placeholder="Enter User ID" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificateName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Name</FormLabel>
                <Input placeholder="Enter Certificate Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificateLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate File</FormLabel>
                <Input type="file" onChange={handleFileChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={uploading} style={{ marginTop: '20px' }}>
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </MaxWidthWrapper>
  );
};

export default UploadCertificate;
