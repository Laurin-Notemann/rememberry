import { MapDeleteInput } from "@frontend/lib/services/maps/map.types";
import { MoveDiagonal, PenLine, X } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

type MapPreviewCardProps = {
  map: {
    name: string;
    description: string;
    id: string;
  };
  openEditMapDialog: (
    isCreate: boolean,
    name: string,
    description: string,
    mapId: string,
  ) => void;
  deleteMap: (
    mapId: MapDeleteInput,
  ) => Promise<readonly [null, boolean] | readonly [string, null]>;
}

export const MapPreviewCard: FC<MapPreviewCardProps> = ({
  map,
  openEditMapDialog,
  deleteMap,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card dark:bg-dark-800 text-card-foreground shadow-sm p-3 w-72">
      <div className="flex gap-1">
        <button
          className="bg-red-500 rounded-full p-1"
          onClick={async () => await deleteMap(map.id)}
        >
          <X size="12" strokeWidth="3" color="#7E0508" />
        </button>
        <button
          className="bg-yellow-500 rounded-full p-1"
          onClick={() =>
            openEditMapDialog(false, map.name, map.description, map.id)
          }
        >
          <PenLine size="12" strokeWidth="3" color="#985712" />
        </button>
        <button
          className="bg-green-500 rounded-full p-1"
          onClick={() => console.log("Fix implemented VIEW BUTTON soon")}
        >
          <MoveDiagonal size="12" strokeWidth="3" color="#0B650D" />
        </button>
      </div>
      <Link href={"/map/" + map.id}>
        <div className="flex flex-col justify-center items-center p-4 gap-3">
          <div className=" text-primary text-xl font-semibold overflow-ellipsis line-clamp-1">
            {map.name}
          </div>

          <div className="dark:bg-dark-800 line-clamp-2 break-words w-4/5">
            {map.description}
          </div>
        </div>
      </Link>
    </div>
  );
};
