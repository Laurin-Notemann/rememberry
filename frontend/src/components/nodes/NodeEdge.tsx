import { FC } from "react";
import { BaseEdge, EdgeProps, getStraightPath } from "reactflow";

/**
 * the line drawn between flashcard nodes
 */
export const NodeEdge: FC<EdgeProps> = ({ ...props }) => {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 20,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} />;
};
