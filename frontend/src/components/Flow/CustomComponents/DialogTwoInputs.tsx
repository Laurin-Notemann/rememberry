import React, { useState } from "react";
import { DialogTwoInputsUI } from "./DialogTwoInputsUi";

interface DialogTwoInputsStatefulProps {
  topInput: string;
  bottomInput: string;
  placeholderTopInput: string;
  placeholderBottomInput: string;
  isDialogOpen: boolean;
  onSubmit: (topInput: string, bottomInput: string) => void;
  closeDialog: () => void;
  classNameInputFields: string;
}

/**
 * a small modal with two inputs.
 * we use this e.g. for the "create map" dialog and the "create node" dialog.
 */
export const DialogTwoInputs: React.FC<DialogTwoInputsStatefulProps> = ({
  topInput,
  bottomInput,
  isDialogOpen,
  placeholderTopInput,
  placeholderBottomInput,
  onSubmit,
  closeDialog,
  classNameInputFields = "",
}) => {
  const [topInputState, setTopInputState] = useState(topInput);
  const [bottomInputState, setBottomInputState] = useState(bottomInput);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topInputState, bottomInputState);
    closeDialog();
  };

  const discardChanges = () => {
    setTopInputState(topInput);
    setBottomInputState(bottomInput);
    closeDialog();
  };

  return (
    <DialogTwoInputsUI
      topInput={topInputState}
      bottomInput={bottomInputState}
      placeholderTopInput={placeholderTopInput}
      placeholderBottomInput={placeholderBottomInput}
      isDialogOpen={isDialogOpen}
      closeDialog={closeDialog}
      onSubmit={handleSubmit}
      discardChanges={discardChanges}
      changeTopInput={(value: string) => setTopInputState(value)}
      changeBottomInput={(value: string) => setBottomInputState(value)}
      classNameInputFields={classNameInputFields}
    />
  );
};
