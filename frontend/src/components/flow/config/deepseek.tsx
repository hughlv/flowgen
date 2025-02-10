import { ConversableAgentConfig } from './conversable-agent';

export const DeepSeekConfig = ({ nodeId, data, className, ...props }: any) => {
  return (
    <ConversableAgentConfig
      nodeId={nodeId}
      data={data}
      className={className}
      toolScene={'llm'}
      optionsDisabled={[
        'enable_code_execution',
        'enable_llm',
        'model_id',
        'human_input_mode',
      ]}
      {...props}
    />
  );
};
