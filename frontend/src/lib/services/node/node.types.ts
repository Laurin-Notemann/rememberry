import { Node as NodeType } from "@backend/db/schema";
import { Node as ReactFlowNode } from "reactflow";
import { RouterInput, RouterOutput } from "../trpc/client";

export type NodeData = Omit<NodeType, "id" | "xPosition" | "yPosition"> & {
  editNode: (nodeId: string) => void;
  deleteNode: (input: NodeDeleteInput) => Promise<unknown>;
};
export type Node = ReactFlowNode<NodeData>;

export type NodeCreationInput = RouterInput["node"]["create"];
export type NodeCreationOutput = RouterOutput["node"]["create"];

export type NodeDeleteInput = RouterInput["node"]["deleteWithAllChildren"];
export type NodeDeleteOutput = RouterOutput["node"]["deleteWithAllChildren"];

export type NodeUpdateInput = RouterInput["node"]["updateById"];
export type NodeUpdateOutput = RouterOutput["node"]["updateById"];
