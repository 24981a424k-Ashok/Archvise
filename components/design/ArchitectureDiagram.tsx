"use client"

import React from 'react'
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow'
import 'reactflow/dist/style.css'
import { Maximize2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

interface ArchitectureDiagramProps {
  nodes: Node[]
  edges: Edge[]
}

export default function ArchitectureDiagram({ nodes, edges }: ArchitectureDiagramProps) {
  // Styles for custom reactflow nodes
  const nodeTypes = {} // Can extend later if we have custom components
  
  const FlowInstance = ({ isFullscreen = false }: { isFullscreen?: boolean }) => (
    <div className={`w-full bg-surface border border-border rounded-lg relative overflow-hidden ${
      isFullscreen ? 'h-[80vh]' : 'h-[450px]'
    }`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.2}
        maxZoom={2.0}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2D2D2D" gap={20} size={1} />
        <Controls className="!bg-card !border-border !fill-textPrimary !text-textPrimary" />
        <MiniMap 
          className="!bg-card !border-border" 
          maskColor="rgba(10,10,10,0.7)" 
          nodeColor="#3B82F6" 
          nodeStrokeWidth={0}
        />
      </ReactFlow>
      
      {!isFullscreen && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="absolute right-3 top-3 z-10 text-xs flex items-center space-x-1"
            >
              <Maximize2 size={12} />
              <span>Fullscreen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl w-[90vw] bg-card p-4 border border-border">
            <h3 className="font-semibold text-sm mb-2 text-textPrimary">Architecture Diagram View</h3>
            <FlowInstance isFullscreen />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )

  return <FlowInstance />
}
export { ArchitectureDiagram }
