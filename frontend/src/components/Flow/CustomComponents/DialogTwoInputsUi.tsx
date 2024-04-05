import { Button } from "@frontend/components/ui/button";
import { Dialog, DialogContent } from "@frontend/components/ui/dialog";
import React, { useRef } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { FlowTextArea } from "./flowTextArea";

interface DialogTwoInputsProps {
  classNameInputFields: string;
  topInput: string;
  bottomInput: string;
  placeholderTopInput: string;
  placeholderBottomInput: string;
  isDialogOpen: boolean;
  autoOpen?: boolean;
  closeDialog: () => void;
  onSubmit: (e: React.FormEvent) => void;
  discardChanges: () => void;
  changeTopInput: (input: string) => void;
  changeBottomInput: (input: string) => void;
}

export const DialogTwoInputsUI: React.FC<DialogTwoInputsProps> = ({
  topInput,
  bottomInput,
  placeholderTopInput,
  placeholderBottomInput,
  isDialogOpen,
  closeDialog,
  onSubmit,
  discardChanges,
  changeTopInput,
  changeBottomInput,
  classNameInputFields = "",
}) => {
  const frontsideAreaRef = useRef<HTMLTextAreaElement>(null);
  const backsideAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontsideAreaRef.current, topInput);
  useAutosizeTextArea(backsideAreaRef.current, bottomInput);

  return (
    <Dialog open={isDialogOpen} onOpenChange={discardChanges}>
      <DialogContent onAbort={closeDialog}>
        <form onSubmit={onSubmit}>
          <div>
            <div>
              <FlowTextArea
                className={classNameInputFields}
                value={topInput}
                placeholder={placeholderTopInput}
                textAreaRef={frontsideAreaRef}
                changes={(value: string) => changeTopInput(value)}
                isFocussed={true}
                isInput={true}
                onSubmit={onSubmit}
              />
            </div>

            <div className="leading-6 text-justify">
              <FlowTextArea
                className={classNameInputFields}
                value={bottomInput}
                placeholder={placeholderBottomInput}
                textAreaRef={backsideAreaRef}
                changes={(value: string) => changeBottomInput(value)}
                isFocussed={false}
                isInput={true}
                onSubmit={onSubmit}
              />
            </div>
            <Button type="submit" className="  mt-4" variant="default">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
