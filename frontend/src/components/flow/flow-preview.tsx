import { edgeTypes, nodeTypes } from '@/lib/flow';
import { cn } from '@/lib/utils';
import { ReactFlow, useStoreApi } from '@xyflow/react';
import { useEffect, useState } from 'react';

interface FlowPreviewProps {
  template: {
    project?: {
      flow?: {
        nodes?: any[];
        edges?: any[];
      };
    };
  };
  className?: string;
}

export const FlowPreview = ({ template, className }: FlowPreviewProps) => {
  const [isReady, setIsReady] = useState(false);
  const store = useStoreApi();

  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      store.getState().onError = (code: string, message: string) => {
        if (code === '002') return;
        console.warn('Workflow warning:', code, message);
      };
    }
    // Small delay to ensure proper rendering
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [store]);

  if (!template?.project?.flow?.nodes || !isReady) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full h-[400px] min-h-[400px]', // Explicit height
        'border rounded-xl overflow-hidden', // Visual container
        className
      )}
    >
      <ReactFlow
        nodes={template.project.flow.nodes}
        edges={template.project.flow.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
        minZoom={0.1}
        maxZoom={1.5}
      />
    </div>
  );
};
