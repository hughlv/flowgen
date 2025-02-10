'use client';

import { GenericOption } from '../option/option';
import { ConversableAgentConfig } from './conversable-agent';

export const UserConfig = ({ nodeId, data }: any) => {
  return (
    <ConversableAgentConfig
      className="flex flex-col gap-4 p-2"
      nodeId={nodeId}
      data={data}
      toolScene={'user'}
    ></ConversableAgentConfig>
  );
};
