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
import { Calendar as CalendarIcon } from "lucide-react"
import { trpc } from '@/app/_trpc/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from "date-fns"

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { redirect } from 'next/navigation';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AnimatedGradientText from '../AnimatedGradientText';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { storage } from '../../../firebase';
import { Textarea } from '../ui/textarea';
import { CalendarRangeIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import {
  FormDescription,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from './../../lib/utils';

const isFileUrl = (value: string) => {
  // You can customize this logic based on how you identify a file URL
  return value.startsWith('file://');
};


const formSchema = z.object({
    eventname: z.string(),
    category   : z.string(),
    date: z.date({
        required_error: "A date of birth is required.",
      }),
    registered: z.number(),
    organizers: z.string(),
    description: z.string(),
    imageLink  : z.string()
});

const AddEventsAdmin = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        eventname: '',
        category   : '',
        date: new Date(),
        registered: 0,
        organizers: '',
        description: '',
        imageLink  : '',   
     },
  });
  const router = useRouter()

  const addEventQuery = trpc.addEvent.useMutation();

  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const imageRef = ref(storage, 'events/' + file.name);
  
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
        toast("Event has been created", {
          description: `${values.eventname} created in the database.`,
        })
       
        router.push('/events')
        
      }

      await addEventQuery.mutate({
        eventname: values.eventname,
        category: values.category,
        date:  new Date(values.date), // Convert the date string to a Date object
        registered: values.registered,
        organizers: values.organizers,
        description: values.description,
        imageLink: form.getValues('imageLink')
      });

      console.log('Done', values);
      redirect('/events')
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <MaxWidthWrapper>
      <AnimatedGradientText>Add Events.</AnimatedGradientText>
      <div style={{ padding: '20px' }}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Form fields for name, branch, role, linkedin, github, imagelink */}
            <FormField
              control={form.control}
              name="eventname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Event Name"
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Event Category"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
                      )}
                      />

            <FormField
              control={form.control}
              name="organizers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Organizers </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(E.g Dhanush,Vishnu)"
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

export default AddEventsAdmin;