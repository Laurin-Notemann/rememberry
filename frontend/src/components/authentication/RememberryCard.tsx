import { FC, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";

type RememberryCardProps = {
  children: ReactNode;
  title: string;
};
export const RememberryCard: FC<RememberryCardProps> = ({
  title,
  children,
}) => {
  return (
    <Card className="flex flex-col gap-4 w-[350px] self-center dark:bg-dark-800 p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
