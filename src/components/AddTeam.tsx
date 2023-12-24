// Import necessary modules and components
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeam } from "@/api/mutations"; // Adjust the import based on your API setup
import * as z from "zod";

// Define the form schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  branch: z.string(),
  role: z.string(),
  linkedin: z.string().url({
    message: "Please enter a valid LinkedIn profile URL.",
  }),
  github: z.string().url({
    message: "Please enter a valid GitHub profile URL.",
  }),
  imageLink: z.string().url({
    message: "Please enter a valid image URL.",
  }),
});

// Define the AddTeam component
const AddTeam = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      branch: "",
      role: "",
      linkedin: "",
      github: "",
      imageLink: "",
    },
  });

  // Create the mutation hook
  const createTeamMutation = useMutation(createTeam);

  // Define the submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the mutation to create a new team
      const result = await createTeamMutation.mutateAsync(values);

      // Handle success (you can redirect or show a success message)
      console.log("Team created successfully:", result);

    } catch (error) {
      // Handle error (display an error message or log the error)
      console.error("Error creating team:", error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Form fields for email, branch, role, LinkedIn, GitHub, imageLink */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Repeat the above pattern for other form fields */}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTeam;
