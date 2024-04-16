"use client";
import { Header } from "@frontend/components/layout/Header";
import { useUserStore } from "../../lib/services/authentication/userStore";
import { ProfilePageCard } from "@frontend/components/profile/ProfilePageCard";
import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsList,
} from "@frontend/components/ui/tabs";
import { LayoutDashboard, Settings, Settings2 } from "lucide-react";
import { SettingsCard } from "@frontend/components/profile/SettingsCard";
import { Separator } from "@frontend/components/ui/separator";
import { useGetMapByUserId } from "@frontend/lib/services/maps/useGetMapsByUserId";
import { rqTrpc } from "@frontend/lib/services/trpc/client";

export default function Profile() {
  const { user } = useUserStore();

  const {
    isLoading: loadingMaps,
    data: maps,
    isSuccess: isSuccessMaps,
  } = useGetMapByUserId(user);

  const { isLoading, data, isSuccess } = rqTrpc.node.getAllByUserId.useQuery(
    user?.id || null,
  );

  if (isLoading || !isSuccess || loadingMaps || !isSuccessMaps) return null;

  const tabsTailwind =
    "p-2 text-xl flex justify-start w-full gap-4 data-[state=active]:p-2 data-[state=active]:bg-dark-700 data-[state=inactive]:hover:bg-dark-800";

  return (
    <div className="flex flex-col gap-8 h-screen">
      <Header />
      <Tabs
        defaultValue="dashboard"
        className="flex-1 flex flex-col md:flex-row gap-8 md:gap-2"
      >
        <>
          <TabsList className=" bg-white dark:bg-dark-900 dark:text-white text-black flex flex-col gap-2 self-center md:self-start md:pl-10">
            <TabsTrigger value="dashboard" className={tabsTailwind}>
              <LayoutDashboard size={24} strokeWidth={1} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className={tabsTailwind}>
              <Settings size={24} strokeWidth={1} />
              User Settings
            </TabsTrigger>
            <TabsTrigger value="preferences" className={tabsTailwind}>
              <Settings2 size={24} strokeWidth={1} />
              Preferences
            </TabsTrigger>
          </TabsList>
          <Separator className="hidden md:block" orientation="vertical" />
        </>
        <div className="flex-1 flex justify-center">
          <TabsContent value="dashboard">
            <div className="flex gap-4">
              <ProfilePageCard title="Your maps">{maps.length}</ProfilePageCard>
              <ProfilePageCard title="Your Nodes">{data.count}</ProfilePageCard>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <SettingsCard />
          </TabsContent>
          <TabsContent value="preferences">
            <p>Test</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
