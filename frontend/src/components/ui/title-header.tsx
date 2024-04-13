import { FC, ReactNode } from "react";

type TitleHeaderProps = {
  children: ReactNode;
};
export const TitleHeader: FC<TitleHeaderProps> = ({ children }) => (
  <h1 className="text-2xl text-primary font-medium">{children}</h1>
);
