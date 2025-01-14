import { Form, Formik, FormikHelpers } from "formik";
import { FormField } from "../authentication/FormField";
import { Button } from "../ui/button";
import { rqTrpc } from "@frontend/lib/services/trpc/client";
import { useRouter } from "next/navigation";
import z from "zod";
import { TRPCClientError } from "@trpc/client";
import { RememberryCard } from "../authentication/RememberryCard";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useUserStore } from "@frontend/lib/services/authentication/userStore";

const UpdateUserFormSchema = z.object({
  username: z.string(),
  email: z.string().email("Must be a valid Email"),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string().min(6, "At least 6 characters"),
});

type UpdateUserFormInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SettingsCard = () => {
  const updateUser = rqTrpc.user.updateUserById.useMutation();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const validateSamePassword = (values: UpdateUserFormInput) => {
    if (values.password !== values.confirmPassword)
      return {
        confirmPassword: "Passwords do not match",
      };
    return {};
  };

  const submit = async (
    values: UpdateUserFormInput,
    { setFieldError }: FormikHelpers<UpdateUserFormInput>,
  ) => {
    try {
      const userToUpdate = {
        id: user.id,
        username: values.username,
        email: values.email,
        password: values.password,
      };
      await updateUser.mutateAsync(userToUpdate);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        if (error.message.includes("Username"))
          setFieldError("username", error.message);
        else if (error.message.includes("Email"))
          setFieldError("email", error.message);
      } else setFieldError("confirmPassword", "something went wrong");
    }
  };
  return (
    <RememberryCard title="Update user">
      <Formik
        initialValues={{
          username: user.username,
          email: user.email,
          password: "",
          confirmPassword: "",
        }}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={toFormikValidationSchema(UpdateUserFormSchema)}
        validate={validateSamePassword}
        onSubmit={submit}
      >
        <Form className="flex flex-col gap-3">
          <FormField
            label="Username"
            name="username"
            type="text"
            placeholder="Username"
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Email"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
          />
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <Button className="w-fit" type="submit">
            Update
          </Button>
        </Form>
      </Formik>
    </RememberryCard>
  );
};
