"use client";
import { Button } from "@frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";
import FormElement from "@frontend/components/ui/formElement";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useUserStore } from "../../lib/services/authentication/userStore";

export default function Settings() {
  const { user } = useUserStore();

  const [initialValues, _setInitialValues] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "", // Passwords are not usually provided for security reasons
  });

  const handleUpdate = async () => {
    // Call your API to update the user details here
    // For example: await updateUserDetails(values);
    console.log("Update values");
    // After updating, you can use actions.setUser to update the state
    // actions.setUser(updatedUserDetails);
  };

  return (
    <div className="relative">
      <div className="z-10 absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="z-10 relative flex flex-col items-center justify-center min-h-screen">
          <div className="w-[400px] h-[480px]">
            <Formik initialValues={initialValues} onSubmit={handleUpdate}>
              {({ isSubmitting }) => (
                <Form>
                  <Card className="dark:bg-dark-800 dark:border-dark-800 p-4">
                    <CardHeader>
                      <CardTitle>
                        Do you want to do some juicy changes? 🫐
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-1.5">
                        <FormElement
                          id="username"
                          type="text"
                          key={initialValues.username}
                          placeholder="Wolfie"
                        />
                        <FormElement
                          id="email"
                          type="email"
                          key={initialValues.email}
                          placeholder="jordan.belfort@gmail.com"
                        />
                        <FormElement
                          id="password"
                          type="password"
                          key={initialValues.password}
                          placeholder="New Password"
                        />
                        <FormElement
                          id="passwordCheck"
                          type="password"
                          key={""}
                          placeholder="New Password"
                        />
                      </div>
                      <Button
                        className="w-fit"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Update Profile
                      </Button>
                    </CardContent>
                  </Card>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
