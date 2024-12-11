export interface NodeData {
    id: string;
    label: string;
    context?: string;
    children?: NodeData[];
  }
  
  export interface ExtractedContent {
    title: string;
    keyPoints: {
      point: string;
      context?: string;
    }[];
  }