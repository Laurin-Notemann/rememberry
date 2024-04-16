import { Form, Formik, FormikHelpers } from "formik";
import { useLoginUser } from "@frontend/lib/services/authentication/useLoginUser";
import { useRouter } from "next/navigation";
import { FormField } from "./FormField";
import { Button } from "../ui/button";
import Link from "next/link";
import { RememberryCard } from "./RememberryCard";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const LoginFormSchema = z.object({
  email: z.string().email("Must be a valid Email"),
  password: z.string(),
});

type LoginFormInput = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const login = useLoginUser();
  const router = useRouter();
  const submit = async (
    values: LoginFormInput,
    { setFieldError }: FormikHelpers<LoginFormInput>,
  ) => {
    const [error, _res] = await login({ user: values });
    if (error) {
      setFieldError("email", error);
    } else {
      setTimeout(() => router.push("/"), 100);
    }
  };
  return (
    <RememberryCard title="Welcome back to rememberry">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={toFormikValidationSchema(LoginFormSchema)}
        onSubmit={submit}
      >
        <Form className="flex flex-col gap-3">
          <FormField
            label="Your Email"
            name="email"
            type="email"
            placeholder="Email"
          />
          <FormField
            label="Your Password"
            name="password"
            type="password"
            placeholder="Password"
          />
          <div className="flex justify-between">
            <Button className="w-fit" type="submit">
              Login
            </Button>
            <Link
              href="/password"
              className="content-end text-primary dark:text-primary underline"
            >
              Forgot password?
            </Link>
          </div>
        </Form>
      </Formik>
    </RememberryCard>
  );
};
