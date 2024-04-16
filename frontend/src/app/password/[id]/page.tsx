"use client";
import { FormField } from "@frontend/components/authentication/FormField";
import { Header } from "@frontend/components/layout/Header";
import { Button } from "@frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";
import { rqTrpc } from "@frontend/lib/services/trpc/client";
import { Form, Formik, FormikHelpers } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { RememberryCard } from "@frontend/components/authentication/RememberryCard";

const FormPasswordResetSchema = z.object({
  password: z.string().min(6, "Must contain 6 characters"),
  confirmPassword: z.string().min(6, "Must contain 6 characters"),
});

type FormInput = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordProps = {
  params: { id: string };
};

export default function ResetPassword({ params }: ResetPasswordProps) {
  const resetPassword = rqTrpc.auth.passwordReset.useMutation();

  const router = useRouter();

  const validateSamePassword = (values: FormInput) => {
    if (values.password !== values.confirmPassword)
      return {
        confirmPassword: "Passwords do not match",
      };
    return {};
  };

  const submit = async (
    values: FormInput,
    { setFieldError }: FormikHelpers<FormInput>,
  ) => {
    try {
      await resetPassword.mutateAsync({
        userId: params.id,
        password: values.password,
      });

      router.push("/login");
    } catch (error) {
      if (error instanceof TRPCClientError)
        setFieldError("confirmPassword", error.message);
      else setFieldError("confirmPassword", "Could not reset User");
    }
  };
  return (
    <div className="flex flex-col">
      <Header />
      <RememberryCard title={"Reset your Password"}>
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validateOnMount={false}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={toFormikValidationSchema(FormPasswordResetSchema)}
          validate={validateSamePassword}
          onSubmit={submit}
        >
          {({ errors }) => (
            <Form className="flex flex-col gap-3">
              <FormField
                label="New Password"
                name="password"
                type="password"
                placeholder="Password"
              />
              <FormField
                label="Confirm new Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
              />
              <Button className="w-fit" type="submit">
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
      </RememberryCard>
    </div>
  );
}
