import { CdcAiAgentResponse } from '@/integrations/cdc-ai-agent.interfaces';

export class ClientError extends Error {
  public readonly data: CdcAiAgentResponse;
  constructor(message: string, agentResponse?: CdcAiAgentResponse) {
    super(message);
    this.name = this.constructor.name;
    this.data = agentResponse;
  }
}
