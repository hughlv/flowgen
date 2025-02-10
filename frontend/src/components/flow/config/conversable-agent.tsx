import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const ConversableAgentConfig = ({
  nodeId,
  data,
  optionsDisabled = [],
  className,
  ...props
}: any) => {
  const [models, setModels] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => setModels(data));
  }, []);

  const GENERAL_OPTIONS = [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Enter a name for this agent',
    },
    {
      type: 'text',
      name: 'description',
      label: 'Description',
      placeholder: 'Enter a description for this agent',
      rows: 2,
    },
    {
      type: 'text',
      name: 'system_message',
      label: 'System Message',
      placeholder: 'Enter the system message for this agent',
      rows: 2,
    },
    {
      type: 'text',
      name: 'termination_msg',
      label: 'Termination Message',
    },
    {
      type: 'select',
      name: 'human_input_mode',
      label: 'Human Input Mode',
      options: [
        { value: 'NEVER', label: 'Never ask for input' },
        { value: 'ALWAYS', label: 'Always ask for input' },
        { value: 'TERMINATE', label: 'Ask on termination' },
      ],
    },
    {
      type: 'range',
      name: 'max_consecutive_auto_reply',
      label: 'Max Consecutive Auto Replies',
      min: 1,
      max: 30,
    },
    {
      type: 'check',
      name: 'enable_llm',
      label: 'Enable LLM',
      defaultChecked: true,
    },
    {
      type: 'select',
      name: 'model_id',
      label: 'AI Model',
      disabled: !data?.enable_llm,
      options:
        models.map((model) => ({
          value: model,
          label: model,
        })) || [],
    },
    {
      type: 'check',
      name: 'enable_code_execution',
      label: 'Enable Code Execution',
    },
  ];

  return (
    <ScrollArea>
      <div
        key={nodeId}
        className={cn(className, 'flex flex-col gap-4 w-full h-full p-2')}
      >
        {GENERAL_OPTIONS.filter((o) => !optionsDisabled.includes(o.name)).map(
          (options, index) => (
            <GenericOption
              key={`${nodeId}-${index}`}
              nodeId={nodeId}
              data={data}
              {...options}
            />
          )
        )}
        {props.children}
      </div>
    </ScrollArea>
  );
};
