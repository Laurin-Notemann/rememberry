"use client";
import { ReactFlowBackground } from "@frontend/components/layout/ReactFlowBackground";
import { NodeEdge } from "@frontend/components/nodes/NodeEdge";
import { NodeMemo } from "@frontend/components/nodes/NodeStateful";
import { DialogTwoInputs } from "@frontend/components/map-node-dialog/DialogTwoInputs";
import { Footer } from "@frontend/components/layout/Footer";
import { Header } from "@frontend/components/layout/Header";
import { Button } from "@frontend/components/ui/button";
import { useGetMapByUserId } from "@frontend/lib/services/maps/useGetMapsByUserId";
import { NodeData } from "@frontend/lib/services/node/node.types";
import { useNodeCreate } from "@frontend/lib/services/node/useCreateNode";
import { useNodeDelete } from "@frontend/lib/services/node/useDeleteNode";
import { useGetNodesByMapId } from "@frontend/lib/services/node/useGetNodesByMapId";
import { useNodeUpdate } from "@frontend/lib/services/node/useUpdateNode";
import {
  databaseNodeToStoreNode,
  storeNodeToDatabaseNode,
} from "@frontend/lib/services/node/utils";
import { nanoid } from "nanoid/non-secure";
import { FC, useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ReactFlow, {
  Controls,
  Edge,
  Node,
  NodeDragHandler,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent } from "@frontend/components/ui/card";
import { DifficultyPicker } from "@frontend/components/layout/DifficultyPicker";
import { TitleHeader } from "@frontend/components/ui/title-header";
import { useUserStore } from "@frontend/lib/services/authentication/userStore";

const nodeTypes = {
  node: NodeMemo,
};

const edgeTypes = {
  node: NodeEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

type MapProps = {
  nodesProp: Node[];
  edgesProp: Edge[];
  mapId: string;
  mapName: string;
};

const Map: FC<MapProps> = ({ nodesProp, edgesProp, mapId, mapName }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(nodesProp);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesProp);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  /** this is defined when the user is creating a new node */
  const [parentNodeId, setParentNodeId] = useState<string | null>(null);
  /** the node that is currently being created */
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [isNodeEditDialogOpen, setIsNodeEditDialogOpen] = useState(false);
  /** if the "create or edit node" dialog is open, whether it's creating a new node or editing an existing one */
  const [isCreateNode, setIsCreateNode] = useState(false);

  const [newNodePosition, setNewNodePosition] = useState({ x: 500, y: 500 });

  const [nodeIdToEdit, setNodeIdToEdit] = useState<string | null>(null);
  const [placeholderTopInput, setPlaceholderTopInput] = useState("");
  const [placeholderBottomInput, setPlaceholderBottomInput] = useState("");

  const { screenToFlowPosition } = useReactFlow();
  const reactflowStore = useStoreApi();

  const createNode = useNodeCreate();
  const updateNode = useNodeUpdate();
  const deleteNode = useNodeDelete();

  useEffect(() => {
    if (nodesProp.length === 0) {
      setIsNodeEditDialogOpen(true);
      setIsCreateNode(true);
    } else {
      if (!nodeIdToEdit) {
        setIsNodeEditDialogOpen(false);
        setIsCreateNode(false);
      }
    }
    setNodes(nodesProp);
    setEdges(edgesProp);
  }, [nodesProp, setNodes, setEdges, edgesProp, nodeIdToEdit]);

  const onDragEnd: NodeDragHandler = async (_event, node, _nodes) => {
    const dbUpdatedNode = storeNodeToDatabaseNode(node);
    await updateNode(dbUpdatedNode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeDialog = () => {
    setIsNodeEditDialogOpen(false);
    setIsCreateNode(false);
    setNodeIdToEdit(null);
  };

  const getChildNodePosition = useCallback(
    (event: MouseEvent, parentNode?: Node) => {
      const { domNode } = reactflowStore.getState();

      if (
        !domNode ||
        // we need to check if these properites exist, because when a node is not initialized yet,
        // it doesn't have a positionAbsolute nor a width or height
        !parentNode?.positionAbsolute ||
        !parentNode?.width ||
        !parentNode?.height
      ) {
        return;
      }

      const { top, left } = domNode.getBoundingClientRect();

      // remove the wrapper bounds, in order to get the correct mouse position
      const panePosition = screenToFlowPosition({
        x: event.clientX - left,
        y: event.clientY - top,
      });

      const x = panePosition.x;
      const y = panePosition.y + parentNode.height / 2;

      return {
        x,
        y,
      };
    },
    [reactflowStore, screenToFlowPosition],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    // remember where the connection started so we can add the new node to the correct parent on connect end
    setConnectingNodeId(nodeId);
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = reactflowStore.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane",
      );

      if (targetIsPane && connectingNodeId) {
        const parentNode = nodeInternals.get(connectingNodeId);

        const childNodePosition = getChildNodePosition(
          event as MouseEvent,
          parentNode,
        );

        if (parentNode && childNodePosition) {
          setParentNodeId(parentNode.id);
          setNewNodePosition(childNodePosition);
          setIsNodeEditDialogOpen(true);
          setIsCreateNode(true);
          setPlaceholderTopInput("");
          setPlaceholderBottomInput("");
        }
      }
    },
    [getChildNodePosition, reactflowStore, connectingNodeId],
  );

  const openDialogEditNode = (nodeId: string) => {
    setIsNodeEditDialogOpen(true);
    setIsCreateNode(false);
    setNodeIdToEdit(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setPlaceholderTopInput(node.data.frontside);
      setPlaceholderBottomInput(node.data.backside);
    } else {
      setPlaceholderTopInput("");
      setPlaceholderBottomInput("");
    }
  };

  const openDialogAddNode = () => {
    const topLevelNode = nodes.find((n) => n.data.parentNodeId === null);
    setIsNodeEditDialogOpen(true);
    setIsCreateNode(true);
    setNewNodePosition({
      x: topLevelNode ? topLevelNode.position.x + 350 : 500,
      y: topLevelNode?.position.y || 500,
    });
    setParentNodeId(null);
    setPlaceholderTopInput("");
    setPlaceholderBottomInput("");
  };

  const onCreateOrEditNode = async (front: string, back: string) => {
    if (isCreateNode) {
      await createNode({
        mapId: mapId,
        frontside: front,
        backside: back,
        xPosition: newNodePosition.x,
        yPosition: newNodePosition.y,
        nodeType: "flashcard",
        parentNodeId: parentNodeId ? parentNodeId : undefined,
      });
      const parentNode = nodes.find((n) => n.id === parentNodeId);
      if (parentNode) {
        parentNode.data.nodeType = "stack";

        const dbParentNode = storeNodeToDatabaseNode(parentNode);
        await updateNode(dbParentNode);
      }
    } else {
      const node = nodes.find((n) => n.id === nodeIdToEdit);

      if (node) {
        node.data.frontside = front;
        node.data.backside = back;

        const dbNode = storeNodeToDatabaseNode(node);
        await updateNode(dbNode);
      }
    }
    setParentNodeId(null);
  };

  //console.log("id", mapId, "name", mapName, "nodes", nodes, "edges", edges);

  const nodesWithHandlers = nodes.map((node) => {
    // nodes could just access these using a store
    node.data.editNode = openDialogEditNode;
    node.data.deleteNode = deleteNode;
    return node;
  });

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <Header
        middleHeaderItems={<TitleHeader>{mapName}</TitleHeader>}
        rightHeaderItems={<DifficultyPicker />}
      />

      <Toaster position="bottom-center" reverseOrder={false} />

      {isNodeEditDialogOpen && (
        <DialogTwoInputs
          topInput={placeholderTopInput}
          bottomInput={placeholderBottomInput}
          placeholderTopInput={"Frontside"}
          placeholderBottomInput={"Backside"}
          isDialogOpen={isNodeEditDialogOpen}
          onSubmit={onCreateOrEditNode}
          closeDialog={closeDialog}
          classNameInputFields={""}
        />
      )}

      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={nodeOrigin}
        onEdgesDelete={(e) => console.log("edge deleted", e)}
        fitView
        minZoom={0.1}
        onNodeDragStop={onDragEnd}
      >
        <ReactFlowBackground />
        {/* <MiniMap /> */}

        <Footer>
          <Button
            variant="default"
            className="border-2 border-white dark:border-dark-900"
            onClick={openDialogAddNode}
          >
            Add flashcard
          </Button>
        </Footer>
      </ReactFlow>
    </div>
  );
};

type MapParams = {
  params: { id: string };
};

export default function MapFlow({ params }: MapParams) {
  const user = useUserStore((store) => store.user);
  const { isLoading, data, isError } = useGetNodesByMapId(params.id);

  const {
    isLoading: mapLoading,
    isSuccess,
    data: maps,
  } = useGetMapByUserId(user);

  if (isLoading || mapLoading || mapLoading || !isSuccess || isError)
    return null;

  const edges = data.reduce<Edge[]>((acc, node) => {
    if (node.parentNodeId) {
      acc.push({
        id: nanoid(),
        source: node.parentNodeId,
        target: node.id,
      });
    }
    return acc;
  }, []);

  const reactFlowNodes = data.map((node) => databaseNodeToStoreNode(node));

  const mapName = maps.find((map) => map.id === params.id)?.name || "";

  return (
    <ReactFlowProvider>
      <Map
        nodesProp={reactFlowNodes}
        edgesProp={edges}
        mapId={params.id}
        mapName={mapName}
      />
    </ReactFlowProvider>
  );
}
