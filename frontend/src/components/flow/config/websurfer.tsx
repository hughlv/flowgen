import { GenericOption } from '../option/option';
import { ConversableAgentConfig } from './conversable-agent';

export const WebSurferConfig = ({ nodeId, data, className, ...props }: any) => {
  return (
    <ConversableAgentConfig
      nodeId={nodeId}
      data={data}
      className={className}
      optionsDisabled={[
        'system_message',
        'enable_llm',
        'enable_code_execution',
        'model_id',
        'human_input_mode',
        'max_consecutive_auto_reply',
        'termination_msg',
      ]}
      {...props}
    >
      <GenericOption
        type="select"
        nodeId={nodeId}
        data={data}
        name="web_tool"
        label="Web Tool"
        options={[
          { value: 'browser_use', label: 'Browser Use' },
          { value: 'crawl4ai', label: 'Crawl4AI', disabled: true },
        ]}
      />
    </ConversableAgentConfig>
  );
};
