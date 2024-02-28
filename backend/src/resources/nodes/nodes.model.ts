import { and, eq, isNull, sql } from "drizzle-orm";
import { db, dbConnection } from "../../db/db";
import { NewNode, Node, nodes } from "../../db/schema";
import {
  TRPCStatus,
  getModelDefaultError,
  getTRPCError,
  hasOnlyOneEntry,
} from "../../utils";

export interface NodeModel {
  createNode: (input: NewNode) => Promise<TRPCStatus<Node>>;
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
    stackId: string,
  ) => Promise<TRPCStatus<Node>>;
  deleteParentNodeRelation: (stackId: string) => Promise<TRPCStatus<Node>>;
  deleteMiddleOrderNodeAndMoveChildrenUp: (
    stackId: string,
  ) => Promise<TRPCStatus<Node[]>>;
  deleteNodeAndChildren: (stackId: string) => Promise<TRPCStatus<Node[]>>;
}

class NodeModelDrizzle implements NodeModel {
  db: dbConnection;
  constructor(db: dbConnection) {
    this.db = db;
  }

  async createNode(input: NewNode) {
    try {
      const node = await this.db.insert(nodes).values(input).returning();

      if (!hasOnlyOneEntry(node)) getTRPCError();
      return [null, node[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getNodeById(nodeId: string) {
    try {
      const prep = this.db
        .select()
        .from(nodes)
        .where(eq(nodes.id, sql.placeholder("id")))
        .prepare("node");
      const node = await prep.execute({ id: nodeId });

      if (!hasOnlyOneEntry(node)) return getTRPCError();

      return [null, node[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getNodesByMapId(mapId: string) {
    try {
      const prep = this.db
        .select()
        .from(nodes)
        .where(eq(nodes.mapId, sql.placeholder("id")))
        .prepare("nodes");
      const selectedNodes = await prep.execute({ id: mapId });

      return [null, selectedNodes] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  /**
   * Get all top Level Stacks (that have no other stack)
   */
  async getTopLevelNodesByMapId(mapId: string) {
    try {
      const prep = this.db
        .select()
        .from(nodes)
        .where(
          and(
            eq(nodes.mapId, sql.placeholder("id")),
            isNull(nodes.parentNodeId),
          ),
        )
        .prepare("topLevelNodes");
      const selectedNodes = await prep.execute({ id: mapId });
      return [null, selectedNodes] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getDirectChildrenNodesFromParentNode(nodeId: string) {
    try {
      const prep = this.db
        .select()
        .from(nodes)
        .where(eq(nodes.parentNodeId, sql.placeholder("id")))
        .prepare("childrenNodes");
      const selectedNodes = await prep.execute({ id: nodeId });
      return [null, selectedNodes] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getAllChildrenNodesFromParentNode(nodeId: string) {
    try {
      const selectedStacks = await this.db.execute(sql`
        WITH RECURSIVE cte_subnodes AS (
        
        SELECT * FROM nodes WHERE id=${nodeId}
    
        UNION ALL
    
        SELECT nodes.* FROM nodes
        JOIN cte_subnodes ON nodes.parentNodeId = cte_subnodes.id
        
        )
        SELECT * 
        FROM cte_subnodes
      `);
      return [null, selectedStacks.rows as Node[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async updateNodeById(node: Node) {
    try {
      const updatedNode = await this.db
        .update(nodes)
        .set(node)
        .where(eq(nodes.id, node.id))
        .returning();
      if (!hasOnlyOneEntry(updatedNode)) return getTRPCError();
      return [null, updatedNode[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async changeParentNode(parentId: string, nodeId: string) {
    try {
      const node = await this.db
        .update(nodes)
        .set({ parentNodeId: parentId })
        .where(eq(nodes.id, nodeId))
        .returning();

      if (!hasOnlyOneEntry(node)) getTRPCError();

      return [null, node[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async deleteParentNodeRelation(nodeId: string) {
    try {
      const node = await this.db
        .update(nodes)
        .set({ parentNodeId: null })
        .where(eq(nodes.id, nodeId))
        .returning();

      if (!hasOnlyOneEntry(node)) getTRPCError();
      return [null, node[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async deleteMiddleOrderNodeAndMoveChildrenUp(nodeId: string) {
    try {
      const updatedNodes = await this.db.transaction(async (tx) => {
        const nodeToDelete = await tx
          .select({ parentId: nodes.parentNodeId })
          .from(nodes)
          .where(eq(nodes.id, nodeId));
        const newParentId = nodeToDelete[0].parentId;

        const updatedNodes = await tx
          .update(nodes)
          .set({
            parentNodeId: newParentId,
          })
          .where(eq(nodes.parentNodeId, nodeId))
          .returning();

        //delete the middle stack
        await tx.delete(nodes).where(eq(nodes.id, nodeId));

        return updatedNodes;
      });
      return [null, updatedNodes] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
  async deleteNodeAndChildren(nodeId: string) {
    try {
      const res = await this.db.execute(sql`
        WITH RECURSIVE nodes_to_delete AS(
        SELECT id FROM nodes
        WHERE id =${nodeId}
  
        UNION
  
        SELECT nodes.id
        FROM nodes
        JOIN nodes_to_delete ON nodes.parentNodeId = nodes_to_delete.id
        )
        DELETE FROM nodes
        WHERE id IN(SELECT id FROM nodes_to_delete)
      `);
      return [null, res.rows as Node[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
}

export const nodeModelDrizzle = new NodeModelDrizzle(db);