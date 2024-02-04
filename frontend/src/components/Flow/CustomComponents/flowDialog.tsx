import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { FlowInput } from "./flowTextArea";

interface FlashcardDialogProps {
  nodeId: string;
  flashcardParentName: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  onSubmit: (frontText: string, backText: string, parentText: string) => void;
  isDialogOpen: boolean;
  closeDialog: () => void;
  cardType: string;
}

export const FlashcardDialog: React.FC<FlashcardDialogProps> = ({
  nodeId,
  flashcardParentName,
  flashcardFrontText,
  flashcardBackText,
  onSubmit,
  isDialogOpen,
  closeDialog,
  cardType,
}) => {
  const [parentName, setParentName] = useState(flashcardParentName);
  const [frontText, setFrontText] = useState(flashcardFrontText);
  const [backText, setBackText] = useState(flashcardBackText);
  const [passedCardType, setPassedCardType] = useState(cardType);

  const handleSubmit = () => {
    onSubmit(frontText, backText, parentName);
    closeDialog();
  };

  const frontTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontTextAreaRef.current, frontText);
  useAutosizeTextArea(backTextAreaRef.current, backText);

  const handleChangeFront = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valFront = evt.target?.value;

    setFrontText(valFront);
  };

  const handleChangeBack = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valBack = evt.target?.value;

    setBackText(valBack);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleSubmit}>
        <DialogContent onAbort={handleSubmit}>
          <div>
            <div>
              <>
                <div className="font-medium text-primary dark:text-white leading-10">
                  {parentName}
                </div>
              </>

              <FlowInput
                className=" "
                value={frontText === "New Front Text" ? "" : frontText}
                placeholder="Front Text"
                textAreaRef={frontTextAreaRef}
                rows={1}
                changes={(value: string) => setFrontText(value)}
                readOnly={false}
                isStack={false}
                isInput={true}
              />
            </div>
            <hr className="m-2" />
            <div className="leading-6 text-justify">
              <FlowInput
                className=" "
                value={backText === "New Back Text" ? "" : backText}
                placeholder="Back Text"
                textAreaRef={backTextAreaRef}
                rows={1}
                changes={(value: string) => setBackText(value)}
                readOnly={false}
                isStack={false}
                isInput={true}
              />
            </div>
            <Button className="  mt-4" variant="default" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
