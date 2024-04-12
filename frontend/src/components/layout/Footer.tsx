"use client";
import { FC } from "react";
import "reactflow/dist/style.css";

export const Footer: FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <div className="fixed z-20 inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center space-x-4">{children}</div>
    </div>
  );
};
