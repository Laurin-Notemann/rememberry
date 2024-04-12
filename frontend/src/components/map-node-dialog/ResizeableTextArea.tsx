import { FC, useEffect, useState } from "react";

type ResizeableTextAreaProps = {
  className: string;
  value: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  placeholder: string;
  isInput: boolean;
  isFocussed: boolean;
  onSubmit: (e: React.FormEvent) => void;
  changes: (value: string) => void;
};

export const ResizeableTextArea: FC<ResizeableTextAreaProps> = ({
  className,
  value,
  textAreaRef,
  placeholder,
  isInput,
  isFocussed,
  onSubmit,
  changes,
}) => {
  const [row, setRow] = useState(1);

  useEffect(() => {
    const newRow = value.split("\n").length || 1;
    setRow(newRow);

    if (textAreaRef.current && isFocussed) {
      textAreaRef.current.focus(); // Focus on the textarea element
      const length = value.length;
      textAreaRef.current.setSelectionRange(length, length); // Set cursor position to the end of the text
    }
  }, [value, isFocussed, textAreaRef]);

  const inputProps = isInput
    ? "focus:outline-primary bg-gray-100 focus:outline-primary mt-5 dark:bg-dark-700  "
    : "outline-none focus:outline-none focus:ring-0  focus:ring-offset-0 ";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid a newline being added
      onSubmit(e);
    }
  };

  return (
    <textarea
      className={`${inputProps} hover:cursor-pointer read-only:visible  rounded-md resize-none break-words flex items-center p-2 justify-between w-full ${className}`}
      value={value}
      ref={textAreaRef}
      placeholder={placeholder}
      rows={row}
      readOnly={!isInput}
      onChange={(e) => changes(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};
