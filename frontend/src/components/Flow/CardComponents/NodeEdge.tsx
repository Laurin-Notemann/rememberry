import { BaseEdge, EdgeProps, getStraightPath } from "reactflow";

/**
 * the line drawn between flashcard nodes
 */
function NodeEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 20,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} />;
}
export default NodeEdge;
