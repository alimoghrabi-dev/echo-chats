import React, { useEffect, useState } from "react";
import { loginUserValidationSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/shared/Input";
import { sanitizeInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { userLogin } from "@/lib/actions";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginUserValidationSchema>>({
    resolver: zodResolver(loginUserValidationSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof loginUserValidationSchema>) => {
      await userLogin(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_STATUS"],
      });

      navigate("/", { replace: true });
      toast("Welcome Back!");

      form.reset();
    },
    onError: (error) => {
      form.setValue("password", "");
      setIsPasswordVisible(false);
      toast.error(error.message || "Something went wrong, please try again.");
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    document.title = `Echo Chats | Login`;
  }, []);

  return (
    <div className="w-full sm:w-[450px] xl:w-[500px] flex flex-col items-start justify-center gap-y-6 p-2 sm:p-0">
      <div className="w-full flex flex-col items-center lg:items-start gap-y-4">
        <h2 className="text-4xl font-semibold text-neutral-50 tracking-wide">
          Welcome Back!
        </h2>
        <span className="flex items-center gap-x-1.5 text-neutral-400 font-normal text-[15px]">
          {`Don't have an account? `}{" "}
          <Link
            to="/register"
            className="underline underline-offset-2 hover:text-neutral-500 transition duration-150"
          >
            Register
          </Link>
        </span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => registerMutation(data))}
          className="w-full space-y-4"
          method="POST"
          autoComplete="off"
          noValidate
        >
          <FormField
            name="identifier"
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
                    label="Email or Username"
                    className="w-full rounded-md text-[15px] bg-foreground text-neutral-50 outline-none border border-neutral-600/75 hover:border-neutral-500 focus-visible:ring-1 focus-visible:ring-primary"
                    labelClassName="bg-foreground"
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
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="w-full max-w-full relative">
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(sanitizeInput(e.target.value))
                      }
                      label="Password"
                      className="w-full select-none rounded-md text-[15px] bg-foreground text-neutral-50 outline-none border border-neutral-600/75 hover:border-neutral-500 focus-visible:ring-1 focus-visible:ring-primary"
                      labelClassName="bg-foreground"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-300 transition"
                    >
                      {isPasswordVisible ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-base font-normal"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
