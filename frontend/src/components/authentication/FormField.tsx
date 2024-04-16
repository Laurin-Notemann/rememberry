import { Field, useField } from "formik";
import { Input } from "../ui/input";
import { FC } from "react";

type FormFieldProps = {
  label: string;
  id?: string;
  name: string;
  type: string;
  placeholder: string;
};

export const FormField: FC<FormFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col gap-1 dark:bg-dark-800">
      <label
        htmlFor={props.id || props.name}
        className="text-sm font-medium dark:bg-dark-800"
      >
        {label}
      </label>
      <Input
        className="bg-gray-100 dark:bg-dark-700 border-none dark:text-white dark:placeholder:text-white/50 text-input"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-error text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};
