// root page
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
import "reactflow/dist/style.css";

export default function Home() {
  const { isLoading, maps } = useGetMapByUserId();

  const userId = useUserStore((state) => state.user?.id || null);
  const createMap = useCreateMap();
  const router = useRouter();
  const deleteMap = useDeleteMap();
  const updateMap = useUpdateMap();

  const {
    dialogOpen,
    isCreate,
    dialogName,
    dialogDescription,
    mapIdEdit,

    openDialog,
    closeDialog,
  } = useCreateOrUpdateMapDialog();

  if (!userId || isLoading) return null;

  const mapsSortedByDescendingCreatedDate = maps.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  /**
   * handles the creation or editing of a map.
   */
  const createOrUpdateMap = async (name: string, description: string) => {
    if (userId) {
      if (isCreate) {
        const [_err, map] = await createMap({
          name,
          description,
          userId: userId,
        });
        if (map) {
          router.push("/map/" + map.id);
        }
      } else {
        const map = maps.find((m) => m.id === mapIdEdit);
        if (map) {
          console.log(name, description);

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
    <div className="relative w-full h-full">
      <h1 className="flex flex-col justify-center items-center mt-16 text-2xl text-primary font-medium">
        Which map do you want to learn today?
      </h1>
      <div className="z-10 absolute top-0 left-0 h-screen">
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
        <div id="body" className="flex content-start p-20 flex-wrap">
          {mapsSortedByDescendingCreatedDate.map(
            (map: { id: string; name: string; description: string }) => (
              <>
                <div className="outline-none   mx-5 my-5" key={map.id}>
                  <Box>
                    <MapPreviewCard
                      map={map}
                      openEditMapDialog={openDialog}
                      deleteMap={deleteMap}
                    />
                  </Box>
                </div>
              </>
            ),
          )}
        </div>
        <Footer>
          <>
            <Button onClick={() => openDialog(true)}>Add Map</Button>
          </>
        </Footer>
      </div>
    </div>
  );
}
