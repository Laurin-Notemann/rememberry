"use client";
import { MapPreviewCard } from "@frontend/components/maps/MapPreviewCard";
import { DialogTwoInputs } from "@frontend/components/map-node-dialog/DialogTwoInputs";
import { Footer } from "@frontend/components/layout/Footer";
import { useCreateOrUpdateMapDialog } from "@frontend/app/_hooks/useCreateOrUpdateMapDialog";
import { Button } from "@frontend/components/ui/button";
import { useUserStore } from "@frontend/lib/services/authentication/userStore";
import { useCreateMap } from "@frontend/lib/services/maps/useCreateMap";
import { useDeleteMap } from "@frontend/lib/services/maps/useDeleteMap";
import { useGetMapByUserId } from "@frontend/lib/services/maps/useGetMapsByUserId";
import { useUpdateMap } from "@frontend/lib/services/maps/useUpdateMap";
import { Box } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { Header } from "@frontend/components/layout/Header";
import { TitleHeader } from "@frontend/components/ui/title-header";
import { FC } from "react";

export default function Root() {
  const user = useUserStore((store) => store.user);

  const { isLoading, isSuccess, isError, data } = useGetMapByUserId(user);

  const createMap = useCreateMap();
  const deleteMap = useDeleteMap();
  const updateMap = useUpdateMap();

  const router = useRouter();

  const {
    dialogOpen,
    isCreate,
    dialogName,
    dialogDescription,
    mapIdEdit,

    openDialog,
    closeDialog,
  } = useCreateOrUpdateMapDialog();

  if (!user || isLoading || !isSuccess || isError) return null;

  const mapsSortedByDescendingCreatedDate = data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  /**
   * handles the creation or editing of a map.
   */
  const createOrUpdateMap = async (name: string, description: string) => {
    if (user!.id) {
      if (isCreate) {
        const [_err, map] = await createMap({
          name,
          description,
          userId: user!.id,
        });
        if (map) {
          router.push("/map/" + map.id);
        }
      } else {
        const map = data.find((m) => m.id === mapIdEdit);
        if (map) {
          map.name = name;
          map.description = description;
          updateMap(map);
        } else {
          // TODO: better error catching
          console.error("no map");
        }
      }
    } else {
      // TODO: better error catching
      console.error("no user");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Header middleHeaderItems={<TitleHeader>Map Overview</TitleHeader>} />
      {dialogOpen && (
        <DialogTwoInputs
          topInput={dialogName}
          bottomInput={dialogDescription}
          placeholderTopInput={"Name"}
          placeholderBottomInput={"Description"}
          isDialogOpen={dialogOpen}
          onSubmit={createOrUpdateMap}
          closeDialog={closeDialog}
          classNameInputFields={""}
        />
      )}
      <div
        id="body"
        className="flex flex-col gap-8 self-center md:flex-wrap md:flex-row md:px-8"
      >
        {mapsSortedByDescendingCreatedDate.map(
          (map: { id: string; name: string; description: string }) => (
            <div className="outline-none" key={map.id}>
              <Box>
                <MapPreviewCard
                  map={map}
                  openEditMapDialog={openDialog}
                  deleteMap={deleteMap}
                />
              </Box>
            </div>
          ),
        )}
      </div>
      <Footer>
        <Button onClick={() => openDialog(true)}>Add Map</Button>
      </Footer>
    </div>
  );
}
