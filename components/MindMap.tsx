'use client'

import React, { useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { NodeData } from '@/app/types/types'

interface MindMapProps {
  data: NodeData
  onNodeClick: (node: NodeData) => void
}

const MindMap: React.FC<MindMapProps> = ({ data, onNodeClick }) => {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    const addNode = (nodeData: NodeData, parentId?: string, depth: number = 0) => {
      const x = depth * 200
      const y = nodes.length * 100

      nodes.push({
        id: nodeData.id,
        data: nodeData,
        position: { x, y },
        style: {
          background: depth === 0 ? '#6366f1' : '#60a5fa',
          color: 'white',
          border: '1px solid #3730a3',
          width: 180,
          borderRadius: '5px',
          padding: '10px',
        },
      })

      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeData.id}`,
          source: parentId,
          target: nodeData.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
        })
      }

      nodeData.children?.forEach((child, index) => addNode(child, nodeData.id, depth + 1))
    }

    addNode(data)

    return { nodes, edges }
  }, [data])

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    onNodeClick(node.data as NodeData)
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-left"
      />
    </div>
  )
}

export default MindMap