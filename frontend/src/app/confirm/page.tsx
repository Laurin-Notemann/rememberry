"use client";
import { Header } from "@frontend/components/layout/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";

export default function Confirm() {
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <Card className="flex flex-col gap-4 self-center dark:bg-dark-800 p-4">
        <CardHeader>
          <CardTitle>Confirm Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Check you mail box and confirm your Email address.</p>
        </CardContent>
      </Card>
    </div>
  );
}
