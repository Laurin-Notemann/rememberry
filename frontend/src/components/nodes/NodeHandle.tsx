import { FC } from "react";
import { Handle, Position } from "reactflow";

type NodeHandleProps = {
  position: Position;
};

export const NodeHandle: FC<NodeHandleProps> = ({ position }) => {
  const handleStyle = {
    // classNames: "dark:bg-colors-dark-500",
    placeSelf: "center",
    height: "0.75rem",
    width: "0.75rem",
    background: "#C4C9D6",
    borderRadius: "0.25rem",
  };

  return (
    <Handle
      type={position === Position.Top ? "target" : "source"}
      position={position}
      style={handleStyle}
    />
  );
};
