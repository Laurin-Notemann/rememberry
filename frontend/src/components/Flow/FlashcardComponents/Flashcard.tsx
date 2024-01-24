// hook that memoizes a function, preventing it from being recreated on each render if its dependencies haven't changed
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import React, { memo, useState } from "react";
import { Handle, Position, useViewport } from "reactflow";
import useStore, { RFState } from "../FlowElements/store";
import { FlashcardDialog } from "./FlashcardDialog";
import { ColorType, TrafficColor, TrafficLights } from "./TrafficLights";

import { shallow } from "zustand/shallow";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const normalizeZoom = (zoom: number): number => {
  return 1 / zoom;
};

interface NodeProps {
  id: string;
}

interface FlashcardProps extends NodeProps {
  data: {
    category: string;
    frontText: string;
    backText: string;
    borderColor?: ColorType;
  };
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, id }) => {
  const [isFront, setIsFront] = useState(true);
  const [category, setCategory] = useState(data.category);
  const [frontText, setFront] = useState(data.frontText);



  const [selectedColor, setSelectedColor] = useState<
    ColorType | null | undefined
  >(data.borderColor);

  const toggleCard = () => {
    setIsFront(!isFront);
  };

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
  };

  const { zoom } = useViewport();



  const [isFocused, setIsFocused] = useState(false);

  function onFocus() {
    setTimeout(setIsFocused, 0, true);
  }
  function onBlur() {
    setTimeout(setIsFocused, 0, false);
  }
  const borderStyle = `border-${TrafficColor[selectedColor!] || "ashberry"}`;

  return (
    <div
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`dragHandle min-w-48 relative box-border bg-white flex flex-col rounded-lg items-center justify-center h-auto max-w-xs border-2 ${borderStyle} border-opacity-25 hover:border-opacity-50 `}
      style={{
        borderWidth: normalizeZoom(zoom) * 3,
      }}
    >
      {isFocused && (
        <div
          className="absolute"
          style={{
            right: "-5rem",
            transform: `scale(${normalizeZoom(zoom)})`,
          }}
        >
          <div className="flex flex-row align-middle ml-2">
            <div className="pr-2 mt-1">
              <TrafficLights onColorChange={handleColorChange} />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Button onClick={toggleCard} variant="secondary" size="icon">
                <RotateCcw />
              </Button>
              <FlashcardDialog
                nodeId={id}
                backText={data.backText}
                flashcardCategory={category}
                flashcardFrontText={frontText}
                flashcardBackText={data.backText}
              />
            </div>
          </div>
        </div>
      )}
      <button tabIndex={0} onClick={toggleCard}>
        <div className="p-4 rounded-lg ">
          <div className="inputWrapper">
            <div>
              <div className="flex items-center justify-between">
                <span>
                  <p className="text-wrap break-words ">
                    {isFront ? frontText : data.backText}
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          placeSelf: "center",
          height: "0.75rem",
          width: "0.75rem",
          background: "#C4C9D6",
          borderRadius: "0.25rem",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          placeSelf: "center",
          height: "0.75rem",
          width: "0.75rem",
          background: "#C4C9D6",
          borderRadius: "0.25rem",
        }}
      />
    </div>
  );
};

export default memo(Flashcard);
