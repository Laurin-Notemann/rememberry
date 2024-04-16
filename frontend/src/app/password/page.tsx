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
import { useState } from "react";
import { RememberryCard } from "@frontend/components/authentication/RememberryCard";

const Schema = z.object({
  email: z.string().email(""),
});

type FormInput = {
  email: string;
};

export default function Password() {
  const [success, setSuccess] = useState(false);
  const sendMail = rqTrpc.auth.passwordResetEmail.useMutation();

  const sendMailOnSubmit = async (
    values: FormInput,
    { setFieldError }: FormikHelpers<FormInput>,
  ) => {
    try {
      await sendMail.mutateAsync(values.email);
      setSuccess(true);
    } catch (error) {
      if (error instanceof TRPCClientError)
        setFieldError("email", error.message);
      else setFieldError("email", "Could not send Email");
    }
  };
  return (
    <div className="flex flex-col">
      <Header />
      <RememberryCard title={"Reset your Password"}>
        <Formik
          initialValues={{
            email: "",
          }}
          validateOnMount={false}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={toFormikValidationSchema(Schema)}
          onSubmit={sendMailOnSubmit}
        >
          <Form className="flex flex-col gap-4">
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <Button className="w-fit" type="submit">
              Request Password Reset
            </Button>
            {success && <p className="text-m">Email sent</p>}
          </Form>
        </Formik>
      </RememberryCard>
    </div>
  );
}
