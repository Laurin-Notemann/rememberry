"use client";
import React from "react";
import ReactFlow, { Background, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

export const ReactFlowBackground = () => (
  <ReactFlowProvider>
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <ReactFlow zoomOnPinch={false}>
        <Background className="  bg-white dark:bg-dark-900" />
      </ReactFlow>
    </div>
  </ReactFlowProvider>
);
