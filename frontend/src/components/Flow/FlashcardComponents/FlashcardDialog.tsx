import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import React, { useState } from "react";

interface FlashcardDialogProps {
  nodeId: string;
  flashcardCategory: string;
  flashcardFrontText: string;
  flashcardBackText: string;
  backText: string;
}

export const FlashcardDialog: React.FC<FlashcardDialogProps> = ({
  nodeId,
  flashcardCategory,
  flashcardFrontText,
  flashcardBackText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [category, setCategory] = useState(flashcardCategory);
  const [frontText, setFront] = useState(flashcardFrontText);
  const [backText, setBackText] = useState(flashcardBackText);



  const openDialog = () => {
    setIsOpen(true);
  };
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* <Dialog isOpen={openDialog} onDismiss={closeDialog}> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="">
            <Maximize2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div>
            <div>
              <div className="font-medium text-primary leading-10">
                {flashcardCategory}
              </div>
              <div className="font-semibold leading-10">
                <input
                  className="w-full text-justify p-2 rounded-md focus:bg-gray-100 focus:outline-none"
                  type="text"
                  defaultValue={frontText}
                  onChange={(e) => setFront(e.target.value)}
                ></input>
              </div>
              <div className="leading-6 text-justify">
                <input
                  className="w-full text-justify p-2 rounded-md focus:bg-gray-100 focus:outline-none"
                  type="text"
                  defaultValue={backText}
                  onChange={(e) => setBackText(e.target.value)}
                ></input>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
