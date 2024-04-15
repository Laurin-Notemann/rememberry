import { Form, Formik } from "formik";
import { ProfilePageCard } from "./ProfilePageCard";
import { FormField } from "../authentication/FormField";
import { useState } from "react";
import { Button } from "../ui/button";

export const SettingsCard = () => {
  const [initialValues, _setInitialValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleUpdate = async () => {};
  return (
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
                <Button className="w-fit" type="submit" disabled={isSubmitting}>
                  Update Profile
                </Button>
              </ProfilePageCard>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
