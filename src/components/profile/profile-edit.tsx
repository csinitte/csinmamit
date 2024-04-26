import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  BookText,
  LinkedinIcon,
  ChevronDown,
  CircleUserRound,
  Phone,
  GitBranch,
  UserCheck
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { api } from "~/utils/api";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name : z.string(),
  bio:  z.string(),
  phone : z.string(),
  branch: z.string(),
  github: z.string(),
  linkedin: z.string(),
});
const branches = ["Artificial Intelligence & Data Science" ,"Artificial Intelligence & Machine Learning" ,"Biotechnology" ,"Civil Engineering" ,"Computer & Communication Engineering" ,"Computer Science & Engineering" ,"Computer Science (Full Stack Development)" ,"Computer Science (Cyber Security)" ,"Electrical & Electronics Engineering" ,"Electronics & Communication Engineering" ,"Electronics (VLSI Design & Technology)" ,"Electronics & Communication Engineering(ACT)" ,"Information Science & Engineering" ,"Mechanical Engineering" ,"Robotics & Artificial Intelligence"];

import { zodResolver } from '@hookform/resolvers/zod';

export const EditProfile = () => {



  const { data: session } = useSession();
  const user = session?.user;
  const id = user?.id ?? " ";
  const userData = api.user.getUserData.useQuery({ userid: id }).data;
  const router = useRouter();
  if (!user) router.push("/");
  const [openbranchList, setOpenbranchList] = useState(false);
  const [branchvalue, setbranchvalue] = useState("");
  const editProfile = api.user.editUserData.useMutation();
  
  const [formData, setFormData] = useState({
    name: userData?.name ?? "",
    bio: userData?.bio ?? "",
    branch: userData?.branch ?? "",
    github: userData?.github ?? "",
    linkedin: userData?.linkedin ?? "",
    phone: userData?.phone ?? "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name : userData?.name ?? "",
        bio:  userData?.bio ?? "",
        branch: userData?.branch ?? "",
        github: userData?.github ?? "",
        linkedin: userData?.linkedin ?? "",
        phone: userData?.phone ?? "",
    },
  });


  const onSubmit = async () => {
    try {
        
      console.log(formData);

      await editProfile.mutateAsync({
        userid : id,
        name : formData.name,
        bio:  formData.bio,
        branch: formData.branch,
        github: formData.github,
        linkedin: formData.linkedin,
        phone: formData.phone, 
      });

      toast("User has been created", {
        description: `${formData.name} entry created in the database.`,
      })
     
      router.push('/profile')
    console.log('Done', formData);
  } catch (error) {
    console.error('Error creating team:', error);
  } 
  };

  return (
    <>
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
              <UserCheck size={20} />
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
              placeholder="Name"
            />
          </div>

          <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
            Branch :
          </p>
          <div className="flex">
            <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
              <BookText size={20} />
            </span>
            <select
                      
                      style={{ padding: '10px', fontSize: '16px' }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Branch
                      </option>
                      {branches.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
          </div>

          <p className="mb-1 mt-3 block text-sm font-medium text-gray-900 dark:text-white">
            Github :
          </p>
          <div className="flex">
            <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
              <GitBranch size={20} />
            </span>
            <Input
              id="github"
              value={formData.github}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  github: e.target.value,
                })
              }
              type="text"
              className="rounded-none rounded-r-lg"
              placeholder="Name"
            />
          </div>

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
              placeholder="Name"
            />
          </div>
          
        </CardContent>
      </Card>
      
      <div className="mt-5 flex w-full items-center justify-center gap-5">
        <Button
          onClick={onSubmit}>
          Save profile
        </Button>
      </div>
    </>
  );
};