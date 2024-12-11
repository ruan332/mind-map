'use client'

import React, { useMemo, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Position,
  MiniMap,
  Background,
  BackgroundVariant
} from 'reactflow'
import 'reactflow/dist/style.css'
import { NodeData } from '@/app/types/types'
import { FileUp } from 'lucide-react'
import { Button } from './ui/button'

interface MindMapProps {
  data: NodeData
  onNodeClick: (node: NodeData) => void
}

const proOptions = { hideAttribution: true };

export default function MindMap({ data, onNodeClick }: MindMapProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const allIds = new Set<string>();
    const collectIds = (node: NodeData) => {
      allIds.add(node.id);
      node.children?.forEach(child => collectIds(child));
    };
    collectIds(data);
    return allIds;
  });

  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number, y: number } }>({})

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    let xOffset = 50
    const ySpacing = 100
    
    const processNode = (node: NodeData, level: number, parentId?: string) => {
      const nodeWidth = 200
      const xSpacing = nodeWidth + 100
      const hasChildren = node.children && node.children.length > 0
      const isExpanded = expandedNodes.has(node.id)
      
      nodes.push({
        id: node.id,
        data: { 
          label: node.label,
          hasChildren
        },
        className: `react-flow__node-default ${hasChildren ? 'cursor-pointer' : ''} bg-white text-black p-2 rounded-lg border border-gray-200`,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        position: { 
          x: level * xSpacing,
          y: xOffset * ySpacing
        },
      })

      if (parentId) {
        edges.push({
          id: `${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
          type: 'bezier',
          animated: true,
          style: { stroke: '#94a3b8' },
        })
      }

      if (isExpanded) {
        node.children?.forEach((child, index) => {
          xOffset++
          processNode(child, level + 1, node.id)
        })
      }
    }

    processNode(data, 0)
    return { nodes, edges }
  }, [data, expandedNodes])

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.data.hasChildren) {
      setExpandedNodes(prev => {
        const next = new Set(prev)
        if (next.has(node.id)) {
          next.delete(node.id)
        } else {
          next.add(node.id)
        }
        return next
      })
    }
    onNodeClick(node.data)
  }

  if (!data.children?.length) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white font-system">
        <div className="text-center space-y-4 max-w-[400px] mx-auto p-8">
          <FileUp className="h-12 w-12 text-zinc-400 mx-auto" />
          <h3 className="text-xl font-medium">No Mind Map Yet</h3>
          <p className="text-sm text-zinc-500">
            Upload a PDF document to automatically generate an interactive mind map of its key points and concepts.
          </p>
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            variant="outline"
            className="mt-4"
          >
            Create Mind Map
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ReactFlow 
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      draggable={true}
      fitView
      proOptions={proOptions}
      className="bg-zinc-25 rounded-l overflow-hidden"    
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  )
}