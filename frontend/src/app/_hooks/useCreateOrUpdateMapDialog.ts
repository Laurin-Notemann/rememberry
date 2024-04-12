import { useState } from "react";

export default function useCreateOrUpdateMapDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [dialogName, setDialogName] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [mapIdEdit, setMapIdEdit] = useState("");

  const openDialog = (
    isCreate: boolean,
    name = "",
    description = "",
    mapId?: string,
  ) => {
    setDialogOpen(true);
    setIsCreate(isCreate);
    setDialogName(name);
    setDialogDescription(description);
    if (!isCreate && mapId) {
      setMapIdEdit(mapId);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogName("");
    setDialogDescription("");
    setMapIdEdit("");
  };

  return {
    dialogOpen,
    isCreate,
    dialogName,
    dialogDescription,
    mapIdEdit,

    openDialog,
    closeDialog,
  };
}
