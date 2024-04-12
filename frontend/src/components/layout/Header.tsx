import { DifficultyPicker } from "@frontend/components/layout/DifficultyPicker";
import { DarkWhiteModeToggle } from "@frontend/components/layout/DarkWhiteModeToggle";
import { SidebarButton } from "@frontend/components/layout/SidebarButton";
import { Button } from "@frontend/components/ui/button";
import { Card } from "@frontend/components/ui/card";
import useGetMapByUserId from "@frontend/lib/services/maps/useGetMapsByUserId";
import Link from "next/link";
import { Panel } from "reactflow";
import { FC } from "react";

type HeaderProps = {
  isOpen: boolean;
  mapName: string;
  toggleSidebar: () => void;
  openHandler: () => void;
}

export const Header: FC<HeaderProps> = ({
  isOpen,
  mapName,
  openHandler,
}) => {
  //Todo: on sidebar open, show maps

  const { isLoading, maps } = useGetMapByUserId();
  if (isLoading) {
    return null;
  }

  const sortedMaps = maps.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <div className="relative ">
        <div
          className={`fixed z-10 ${isOpen ? "translate-x-0" : "-translate-x-full"
            } ease-in-out duration-300 flex flex-row `}
        >
          <div className=" overflow-scroll w-56 h-screen bg-white dark:bg-dark-900 px-5 border-r-2 pt-5 dark:border-dark-300/50">
            <h1 className=" text-lg font-semibold text-center text-primary mb-4">
              Learn another map:
            </h1>
            {sortedMaps.map((map) => (
              <Link href={`/map/${map.id}`} key={map.id}>
                <Card className="flex w-full my-2 hover:bg-gray-100 dark:hover:bg-dark-600 dark:bg-dark-700 p-2">
                  <div className="justify-center p-1 text-center ">
                    <p>{map.name}</p>
                    <p className="text-xs mt-1">{map.description}</p>
                  </div>
                  <p
                    className="text-end text-gray-300 mt-2 mr-1"
                    style={{ fontSize: "10px" }}
                  >
                    {map.updatedAt.toDateString().split(" ").slice(1).join(" ")}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
          <div className="ml-2  mt-8">
            <SidebarButton isOpen={isOpen} toggleSidebar={openHandler} />
          </div>
        </div>
      </div>
      <Panel
        position="top-center"
        style={{
          justifyContent: "space-between",
          width: "95%",
          marginTop: "2rem",
          paddingRight: "1rem",
        }}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex gap-5">
            <SidebarButton isOpen={isOpen} toggleSidebar={openHandler} />
            <Link href="/">
              <Button variant="outline" className="p-3">
                🫐 <p className="ml-2 text-sm">{mapName}</p>
              </Button>
            </Link>
          </div>
          <div className="flex gap-5">
            <DifficultyPicker />
            <DarkWhiteModeToggle />
          </div>
        </div>
      </Panel>
    </div>
  );
};
