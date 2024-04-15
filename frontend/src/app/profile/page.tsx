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
import { TitleHeader } from "@frontend/components/ui/title-header";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useUserStore } from "../../lib/services/authentication/userStore";
import { ProfilePageCard } from "@frontend/components/profile/ProfilePageCard";

export default function Profile() {
  const { user } = useUserStore();

  const [initialValues, _setInitialValues] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const handleUpdate = async () => {};

  return (
    <div className="top-0 left-0 w-full h-full items-center justify-center">
      <Header
        middleHeaderItems={<TitleHeader>Hello {user?.username}</TitleHeader>}
      />
      <div className="flex gap-10">
        <div className="flex">
          <ProfilePageCard title="Your maps">3</ProfilePageCard>
          <ProfilePageCard title="Your Nodes">3</ProfilePageCard>
        </div>
        <div className="flex">
          <div className="w-[400px] h-[480px]">
            <Formik initialValues={initialValues} onSubmit={handleUpdate}>
              {({ isSubmitting }) => (
                <Form>
                  <ProfilePageCard title="Do you want to do some changes? 🫐">
                    <div className="flex flex-col gap-1.5">
                      <FormField
                        id="username"
                        type="text"
                        key={initialValues.username}
                        placeholder="Wolfie"
                      />
                      <FormField
                        id="email"
                        type="email"
                        key={initialValues.email}
                        placeholder="jordan.belfort@gmail.com"
                      />
                      <FormField
                        id="password"
                        type="password"
                        key={initialValues.password}
                        placeholder="New Password"
                      />
                      <FormField
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
                  </ProfilePageCard>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="flex"></div>
      </div>
    </div>
  );
}
