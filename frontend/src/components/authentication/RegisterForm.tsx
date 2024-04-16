import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { FormField } from "./FormField";
import { Button } from "../ui/button";
import { useRegisterUser } from "@frontend/lib/services/authentication/useRegisterUser";
import z from "zod";
import { RememberryCard } from "./RememberryCard";
import { toFormikValidationSchema } from "zod-formik-adapter";

const RegisterFormSchema = z.object({
  username: z.string(),
  email: z.string().email("Must be a valid Email"),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string().min(6, "At least 6 characters"),
});

type RegisterFormInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const register = useRegisterUser();
  const router = useRouter();

  const validateSamePassword = (values: RegisterFormInput) => {
    if (values.password !== values.confirmPassword)
      return {
        confirmPassword: "Passwords do not match",
      };
    return {};
  };

  const submit = async (
    values: RegisterFormInput,
    { setFieldError }: FormikHelpers<RegisterFormInput>,
  ) => {
    const [error] = await register({ user: values });
    if (error) {
      if (error.includes("Username")) setFieldError("username", error);
      else if (error.includes("Email")) setFieldError("email", error);
      else setFieldError("confirmPassword", error);
    } else {
      console.log("test");

      setTimeout(() => router.push("/confirm"), 200);
    }
  };
  return (
    <RememberryCard title="Welcome to rememberry">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={toFormikValidationSchema(RegisterFormSchema)}
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
            Register
          </Button>
        </Form>
      </Formik>
    </RememberryCard>
  );
};
