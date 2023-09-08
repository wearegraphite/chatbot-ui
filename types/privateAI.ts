
export interface PrivateAIModel {
  id: string;
  name: string;
}

export enum PrivateAIModelID {
  PRIVATE_AI = 'privateAI',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = PrivateAIModelID.PRIVATE_AI;

export const PrivateAIModels: Record<PrivateAIModelID, PrivateAIModel> = {
  [PrivateAIModelID.PRIVATE_AI]: {
    id: PrivateAIModelID.PRIVATE_AI,
    name: PrivateAIModelID['PRIVATE_AI']
  },
};
