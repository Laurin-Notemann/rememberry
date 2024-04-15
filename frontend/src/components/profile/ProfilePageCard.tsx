import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";
import { FC, ReactNode } from "react";

type ProfilePageCardProps = {
  title: string;
  children: ReactNode;
};

export const ProfilePageCard: FC<ProfilePageCardProps> = ({
  title,
  children,
}) => {
  return (
    <Card className="dark:bg-dark-800 dark:border-dark-800 p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
