//import * as cacheModel from "../cache/cacheModel";

import { NewNode, Node } from "../../db/schema";
import { Logger, ScopedLogger } from "../../logger";
import { TRPCStatus, getTRPCError } from "../../utils";
import { NodeModel, nodeModelDrizzle } from "./nodes.model";

interface NodeController {
  createNode: (input: NewNode) => Promise<TRPCStatus<Node>>;
  getAllByUserId: (
    userId: string,
  ) => Promise<TRPCStatus<{ count: number } | null>>;
  getNodeById: (nodeId: string) => Promise<TRPCStatus<Node>>;
  getNodesByMapId: (mapId: string) => Promise<TRPCStatus<Node[]>>;
  getTopLevelNodesByMapId: (mapId: string) => Promise<TRPCStatus<Node[]>>;
  getDirectChildrenNodesFromParentNode: (
    nodeId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  getAllChildrenNodesFromParentNode: (
    nodeId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  updateNodeById: (node: Node) => Promise<TRPCStatus<Node>>;
  changeParentNode: (
    parentId: string,
    nodeId: string,
  ) => Promise<TRPCStatus<Node>>;
  deleteParentNodeRelation: (stackId: string) => Promise<TRPCStatus<Node>>;
  deleteMiddleOrderNodeAndMoveChildrenUp: (
    stackId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  deleteNodeAndChildren: (stackId: string) => Promise<TRPCStatus<Node[]>>;
}

class NodeControllerDrizzle implements NodeController {
  nodeModel: NodeModel;
  logger: Logger;
  constructor(nodeModel: NodeModel) {
    this.nodeModel = nodeModel;
    this.logger = new ScopedLogger();
  }

  async createNode(newNode: NewNode) {
    const [err, node] = await this.nodeModel.createNode(newNode);
    if (err) return getTRPCError(this.logger, err.message, err.code);
    return [null, node] as const;
  }

  async getAllByUserId(userId: string) {
    const [err, node] = await this.nodeModel.getAllByUserId(userId);
    if (err) return getTRPCError(this.logger, err.message, err.code);
    return [null, node] as const;
  }

  async getNodeById(nodeId: string) {
    const [err, node] = await this.nodeModel.getNodeById(nodeId);
    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, node] as const;
  }

  async getNodesByMapId(mapId: string) {
    //const cacheResult = await cacheModel.readCache(mapId);
    //if (cacheResult) {
    //  return [null, cacheResult] as const;
    //}
    const [err, nodes] = await this.nodeModel.getNodesByMapId(mapId);
    if (err) return getTRPCError(this.logger, err.message, err.code);

    // const stackWithChildren = this.transformToHierarchy(stacks);
    //  cacheModel.cacheValue(mapId, stacks);

    return [null, nodes] as const;
  }

  //private transformToHierarchy(data: StackWithChildren[]): StackWithChildren[] {
  //  const lookup: { [key: string]: StackWithChildren } = {};

  //  for (let i = 0; i < data.length; i++) {
  //    const item = data[i];
  //    lookup[item.id] = item;
  //    item.children = [];
  //  }

  //  for (let i = 0; i < data.length; i++) {
  //    const item = data[i];
  //    const parent_id = item.parentStackId;
  //    if (parent_id && lookup[parent_id]) {
  //      lookup[parent_id].children!.push(item);
  //    }
  //  }

  //  const result: StackWithChildren[] = [];
  //  for (let i = 0; i < data.length; i++) {
  //    const item = data[i];
  //    if (!item.parentStackId) {
  //      result.push(item);
  //    }
  //  }

  //  return result;
  //}

  async getAllChildrenNodesFromParentNode(nodeId: string) {
    //const cacheResult = await cacheModel.readCache(parentStackId);
    // if (cacheResult) {
    //   return [null, cacheResult] as const;
    // }

    const [err, nodes] =
      await this.nodeModel.getAllChildrenNodesFromParentNode(nodeId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    //cacheModel.cacheValue(parentStackId, res);

    return [null, nodes] as const;
  }

  async getTopLevelNodesByMapId(mapId: string) {
    const [err, nodes] = await this.nodeModel.getTopLevelNodesByMapId(mapId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, nodes] as const;
  }

  async getDirectChildrenNodesFromParentNode(parentNodeId: string) {
    const [err, nodes] =
      await this.nodeModel.getDirectChildrenNodesFromParentNode(parentNodeId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, nodes] as const;
  }

  async updateNodeById(node: Node) {
    const [err, updatedNode] = await this.nodeModel.updateNodeById(node);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, updatedNode] as const;
  }

  async changeParentNode(parentId: string, childId: string) {
    const [err, node] = await this.nodeModel.changeParentNode(
      parentId,
      childId,
    );

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, node] as const;
  }

  async deleteParentNodeRelation(nodeId: string) {
    const [err, node] = await this.nodeModel.deleteParentNodeRelation(nodeId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, node] as const;
  }

  async deleteMiddleOrderNodeAndMoveChildrenUp(nodeId: string) {
    const [err, nodes] =
      await this.nodeModel.deleteMiddleOrderNodeAndMoveChildrenUp(nodeId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, nodes] as const;
  }

  async deleteNodeAndChildren(nodeId: string) {
    const [err, nodes] = await this.nodeModel.deleteNodeAndChildren(nodeId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, nodes] as const;
  }
}

export const nodeControllerDrizzle = new NodeControllerDrizzle(
  nodeModelDrizzle,
);
