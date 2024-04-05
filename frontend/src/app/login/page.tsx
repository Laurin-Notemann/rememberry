"use client";
import FlowBackground from "@frontend/components/Flow/Background/flowBackground"; // Adjust the import based on the actual path
import { Button } from "@frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";
import FormElement from "@frontend/components/ui/formElement";
import * as Tabs from "@radix-ui/react-tabs";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import useLoginUser from "../../lib/services/authentication/useLoginUser";
import useRegisterUser from "../../lib/services/authentication/useRegisterUser";

export default function Login() {
  const register = useRegisterUser();
  const login = useLoginUser();
  const router = useRouter();

  return (
    <div className="relative">
      <FlowBackground />

      <div className="z-10 absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="z-10 relative flex flex-col items-center justify-center min-h-screen">
          <Tabs.Root defaultValue="login" className="w-[400px] h-[480px] ">
            <Tabs.List className="dark:bg-dark-800 h-10 rounded-md bg-muted p-1 text-muted-foreground grid w-fit grid-cols-2">
              <Tabs.Trigger
                className="  rounded-sm px-0.75 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background dark:data-[state=active]:bg-dark-500 light:data-[state=active]:text-foreground  dark:data-[state=active]:text-white dark:data-[state=inactive]:text-white/50 data-[state=active]:shadow-sm"
                value="login"
              >
                Login
              </Tabs.Trigger>
              <Tabs.Trigger
                className=" rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background dark:data-[state=active]:bg-dark-500 light:data-[state=active]:text-foreground dark:data-[state=active]:text-white dark:data-[state=inactive]:text-white/50 data-[state=active]:shadow-sm"
                value="register"
              >
                Register
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="mt-2" value="login">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                onSubmit={async (values, { setFieldError }) => {
                  const [error, _res] = await login({ user: values });
                  if (error) {
                    setFieldError("email", error);
                  } else {
                    router.push("/");
                  }
                }}
              >
                {({ errors }) => (
                  <Form className="">
                    <Card className="dark:bg-dark-800 dark:border-dark-800 p-4">
                      <CardHeader>
                        <CardTitle>Welcome back to rememberry :)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {errors.email! && (
                          <p className="text-sm text-error">{errors.email}</p>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <FormElement
                            id="email"
                            type="email"
                            placeholder="Your Email"
                          />
                          <FormElement
                            id="password"
                            type="password"
                            placeholder="Password"
                          />
                        </div>
                        <Button className="w-fit" type="submit">
                          Login
                        </Button>
                      </CardContent>
                    </Card>
                  </Form>
                )}
              </Formik>
            </Tabs.Content>
            <Tabs.Content className="mt-2" value="register">
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                onSubmit={async (values, { setFieldError }) => {
                  if (values.password !== values.confirmPassword) {
                    setFieldError("password", "confirmed password is wrong");
                    return;
                  }

                  const [error, _res] = await register({ user: values });
                  if (error) {
                    setFieldError("email", error);
                  } else {
                    router.push("/");
                  }
                }}
              >
                {({ errors }) => (
                  <Form>
                    <Card className="dark:bg-dark-800 dark:border-dark-800 p-4">
                      <CardHeader>
                        <CardTitle>
                          Ready to start a new learning journey?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="dark:bg-dark-800">
                        <div className="flex flex-col gap-1.5">
                          {errors.email && (
                            <p className="text-sm text-error">{errors.email}</p>
                          )}

                          <FormElement
                            id="username"
                            type="username"
                            placeholder="Username"
                          />
                          <FormElement
                            id="email"
                            type="email"
                            placeholder="Email"
                          />
                          <FormElement
                            id="password"
                            type="password"
                            placeholder="Password"
                          />
                          <FormElement
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                          />
                          {errors.password && (
                            <p className="text-sm text-error">
                              {errors.password}
                            </p>
                          )}
                        </div>
                        <Button className="w-fit" type="submit">
                          Register
                        </Button>
                      </CardContent>
                    </Card>
                  </Form>
                )}
              </Formik>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
