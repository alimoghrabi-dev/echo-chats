import React, { useEffect } from "react";
import { editUserProfileValidationSchema } from "@/lib/validators";
import { sanitizeInput } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import TextArea from "../shared/TextArea";
import { Button } from "../ui/button";
import Input from "../shared/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { updateUserProfile } from "@/lib/actions";
import { z } from "zod";

const EditProfileForm: React.FC<{
  profileId: string;
  firstName: string;
  lastName: string;
  username: string;
  description: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ profileId, firstName, lastName, username, description, setOpen }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof editUserProfileValidationSchema>>({
    resolver: zodResolver(editUserProfileValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      description: "",
    },
  });

  const { mutate: editProfileMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof editUserProfileValidationSchema>
    ) => {
      await updateUserProfile(profileId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["USER"] });
      queryClient.invalidateQueries({
        queryKey: ["AUTH_STATUS"],
      });

      setOpen(false);
      toast.success("Profile updated successfully!");
      form.reset();
    },
    onError: () => {
      toast.error("Failed to update profile!");
      setOpen(false);
    },
  });

  useEffect(() => {
    form.setValue("firstName", firstName || "");
    form.setValue("lastName", lastName || "");
    form.setValue("username", username || "");
    form.setValue("description", description || "");
  }, [firstName, lastName, username, description, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => editProfileMutation(data))}
        className="w-full space-y-3"
        noValidate
      >
        <div className="w-full grid grid-cols-2 gap-2">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(sanitizeInput(e.target.value))
                    }
                    label="First Name"
                    className="w-full rounded-md text-[15px] bg-neutral-50 text-neutral-800 outline-none border border-neutral-400 hover:border-neutral-500 focus-visible:ring-1 focus-visible:ring-primary/85"
                    labelClassName="bg-neutral-50 text-neutral-600 text-sm"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(sanitizeInput(e.target.value))
                    }
                    label="Last Name"
                    className="w-full rounded-md text-[15px] bg-neutral-50 text-neutral-800 outline-none border border-neutral-400 hover:border-neutral-500 focus-visible:ring-1 focus-visible:ring-primary/85"
                    labelClassName="bg-neutral-50 text-neutral-600 text-sm"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(sanitizeInput(e.target.value))
                  }
                  label="Username"
                  className="w-full rounded-md text-[15px] bg-neutral-50 text-neutral-800 outline-none border border-neutral-400 hover:border-neutral-500 focus-visible:ring-1 focus-visible:ring-primary/85"
                  labelClassName="bg-neutral-50 text-neutral-600 text-sm"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextArea
                  rows={3}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(sanitizeInput(e.target.value))
                  }
                  label="Description"
                  className="w-full rounded-md text-[15px] bg-neutral-50 text-neutral-800 outline-none border border-neutral-400 hover:border-neutral-500 focus-visible:ring-1 focus-visible:ring-primary/85"
                  labelClassName="bg-neutral-50 text-neutral-600 text-sm"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending || !form.formState.isDirty}
          className="w-full rounded-md text-[16px] py-6 bg-gradient-to-br from-primary/70 to-primary"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
