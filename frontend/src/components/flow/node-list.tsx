'use client';

import React from 'react';
import { advancedNodes, basicNodes, getNodeIcon } from '@/lib/flow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface NodeItemProps {
  id: string;
  name: string;
  type: string;
  description?: string;
  class_type: string;
  width?: number;
  height?: number;
  onAddNode: (
    id: string,
    name: string,
    class_type: string,
    width?: number,
    height?: number
  ) => void;
}

const NodeItem = ({
  id,
  name,
  type,
  description,
  class_type,
  width,
  height,
  onAddNode,
}: NodeItemProps) => {
  const NodeIcon = getNodeIcon(type);
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: any
  ) => {
    console.log('onDragStart nodeData', nodeData);
    event.dataTransfer.setData('application/json', JSON.stringify(nodeData));
  };

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2 w-full h-full p-2 rounded-md border cursor-grab',
        'hover:bg-muted/80 hover:border-primary/20'
      )}
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
        onDragStart(e, { id, name, type, class_type, width, height })
      }
      onClick={() => onAddNode(id, name, class_type, width, height)}
    >
      <div className="flex items-center gap-2 w-full h-full">
        <NodeIcon className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-left text-xs text-muted-foreground line-clamp-2">
        {description}
      </span>
    </div>
  );
};

const nodeCategories = [
  {
    value: 'basic',
    title: 'Basic',
    nodes: basicNodes,
  },
  {
    value: 'advanced',
    title: 'Advanced',
    nodes: advancedNodes,
  },
];

export const NodeList = ({
  onAddNode,
}: {
  onAddNode: (
    id: string,
    name: string,
    class_type: string,
    width?: number,
    height?: number
  ) => void;
}) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={nodeCategories.map((category) => category.value)}
      className="w-full p-2"
    >
      {nodeCategories.map(({ value, title, nodes }) => (
        <AccordionItem
          value={value}
          className="border-none"
          key={value}
          defaultChecked={true}
        >
          <AccordionTrigger className="text-sm outline-none py-2">
            {title}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 w-full">
            {nodes.map((node) => (
              <NodeItem
                key={node.id}
                id={node.id}
                name={node.name}
                type={node.id}
                description={node.description}
                class_type={node.class_type}
                width={node.width}
                height={node.height}
                onAddNode={onAddNode}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
