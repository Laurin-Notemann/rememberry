import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import React, { useRef } from "react";
import { Position } from "reactflow";
import { NodeDialog } from "../CustomComponents/NodeDialogState";
import { FlowTextArea } from "../CustomComponents/flowTextArea";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { CustomHandle } from "./CustomHandle";
import { ColorType, TrafficLights } from "./TrafficLights";

interface NodeUIProps {
  isFront: boolean;
  frontside: string;
  backside: string;
  borderClasses: string;
  isFocused: boolean;
  normalizeZoom: (zoom: number) => number;
  zoom: number;
  toggleCard: () => void;
  openDialog: () => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
  handleColorChange: (color: ColorType) => void;
  handleDialogSubmit: (frontside: string, backside: string) => void;
  nodeType: string;
  nodeId: string;
  focus: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
  blur: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
}

export const NodeUI: React.FC<NodeUIProps> = ({
  isFront,
  frontside,
  backside,
  borderClasses,
  isFocused,
  normalizeZoom,
  zoom,
  toggleCard,
  openDialog,
  closeDialog,
  isDialogOpen,
  handleColorChange,
  nodeType: nodeType,
  focus,
  blur,
  handleDialogSubmit,
}) => {
  // for multiline textarea
  const frontsideAreaRef = useRef<HTMLTextAreaElement>(null);
  const backsideAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(frontsideAreaRef.current, frontside);
  useAutosizeTextArea(backsideAreaRef.current, backside);

  const colorType =
    nodeType === "stack"
      ? "bg-primary text-white"
      : "bg-white dark:bg-dark-800 ";

  return (
    <div
      tabIndex={0}
      onFocus={focus}
      onBlur={blur}
      className={`dragHandle hover:cursor-pointer ${colorType}  min-w-48 relative border-none  flex flex-col rounded-lg items-center justify-center h-auto max-w-xs `}
      style={{
        borderWidth: normalizeZoom(zoom) * 3,
      }}
    >
      <div onClick={toggleCard} className={`p-2  rounded-lg ${borderClasses}`}>
        <div>
          <FlowTextArea
            className={`${colorType}`}
            value={isFront ? frontside : backside}
            textAreaRef={isFront ? frontsideAreaRef : backsideAreaRef}
            rows={1}
            placeholder={""}
            changes={function (): void {}}
            isInput={false}
            onSubmit={function (): void {}}
          />
        </div>
      </div>

      {isFocused && (
        <div
          className="absolute"
          style={{
            right: `${nodeType === "stack" ? "-3rem" : "-5rem"}`,
            transform: `scale(${normalizeZoom(zoom)})`,
          }}
        >
          <div className="flex relative flex-row align-middle ml-2">
            {nodeType === "flashcard" && (
              <div className=" pr-2 mt-1">
                <TrafficLights onColorChange={handleColorChange} />
              </div>
            )}
            <div className="flex flex-col items-center justify-center ">
              <Button
                variant="secondary"
                size="icon"
                className=""
                onClick={openDialog}
              >
                <Maximize2 />
              </Button>
            </div>
          </div>
        </div>
      )}
      {isDialogOpen && (
        <NodeDialog
          frontside={frontside}
          backside={backside}
          isDialogOpen={isDialogOpen}
          onSubmit={function (): void {}}
          closeDialog={closeDialog}
        ></NodeDialog>
      )}

      <CustomHandle position={Position.Top} />
      <CustomHandle position={Position.Bottom} />
    </div>
  );
};