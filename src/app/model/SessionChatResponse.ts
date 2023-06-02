export interface UserSession {
  id: number;
  sessionId: string;
  agent: Agent;
  timeCreate: string;
  agentId: number;
}

export interface Agent {
  id: number;
  name: string;
  surname: string;
}
