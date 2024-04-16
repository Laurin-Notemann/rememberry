"use client";
import { Header } from "@frontend/components/layout/Header";
import * as Tabs from "@radix-ui/react-tabs";
import { LoginForm } from "@frontend/components/authentication/LoginForm";
import { RegisterForm } from "@frontend/components/authentication/RegisterForm";

export default function Login() {
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <Tabs.Root
        defaultValue="login"
        className="flex flex-col self-center w-[400px] h-[480px] "
      >
        <Tabs.List className="dark:bg-dark-800 h-10 rounded-md bg-muted p-1 text-muted-foreground grid w-fit grid-cols-2">
          <Tabs.Trigger
            className="rounded-sm px-0.75 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background dark:data-[state=active]:bg-dark-500 light:data-[state=active]:text-foreground  dark:data-[state=active]:text-white dark:data-[state=inactive]:text-white/50 data-[state=active]:shadow-sm"
            value="login"
          >
            Login
          </Tabs.Trigger>
          <Tabs.Trigger
            className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background dark:data-[state=active]:bg-dark-500 light:data-[state=active]:text-foreground dark:data-[state=active]:text-white dark:data-[state=inactive]:text-white/50 data-[state=active]:shadow-sm"
            value="register"
          >
            Register
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="mt-2" value="login">
          <LoginForm />
        </Tabs.Content>
        <Tabs.Content className="mt-2" value="register">
          <RegisterForm />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
