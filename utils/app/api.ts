import { OpenAIModelID } from '@/types/openai';
import { Plugin, PluginID } from '@/types/plugin';
import { PrivateAIModelID } from '@/types/privateAI';

export enum EEntryPoints {
  PRIVATE_AI = '/api/chatPrivateAI',
  GOOGLE = '/api/google',
  CHAT = '/api/chat',
}

export const getEndpoint = (plugin: Plugin | null, modelId: string) => {
  if (Object.keys(PrivateAIModelID).find(key => PrivateAIModelID[key as keyof typeof PrivateAIModelID] === modelId)) {
    return EEntryPoints.PRIVATE_AI;
  }

  if (!plugin) {
    return EEntryPoints.CHAT;
  }

  if (plugin?.id === PluginID.GOOGLE_SEARCH) {
    return EEntryPoints.GOOGLE;
  }

  return EEntryPoints.CHAT;
};
