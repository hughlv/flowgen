import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';
import { useSettings } from '@/hooks/use-settings';

interface FieldProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export const ConversableAgentConfig = ({
  nodeId,
  data,
  optionsDisabled = [],
  className,
  ...props
}: any) => {
  const { settings } = useSettings();

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
        settings?.models?.map((model) => ({
          value: model.id,
          label: model.model,
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
      <div key={nodeId} className="flex flex-col gap-4 w-full h-full p-2">
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
      </div>
    </ScrollArea>
  );
};
