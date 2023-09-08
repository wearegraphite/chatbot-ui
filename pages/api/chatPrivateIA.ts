import { ChatBody, Message } from "@/types/chat";
import { OpenAIError } from "@/utils/server";


export const config = {
  runtime: 'edge',
};

const paramDefaults = {
  stream: true,
  n_predict: 500,
  temperature: 0.2,
  stop: ["</s>", "user:", "ChatGPT:"],
  repeat_last_n: 256,
  repeat_penalty: 1.18,
  top_k: 40,
  top_p: 0.5,
  tfs_z: 1,
  typical_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  mirostat: 0,
  mirostat_tau: 5,
  mirostat_eta: 0.1,
};

let generation_settings = null;

const handler = async (req: Request)/*: Promise<Response>*/ => {
  try {
    const { model, messages, key, prompt, temperature } = (await req.json()) as ChatBody;

    let controller;

    if (!controller) {
      controller = new AbortController();
    }

    // merge prompt and messages
    const mergedPrompt = `${prompt}\n${messages.map((m: Message) => `${m.role}: ${m.content}`).join('\n')}\nassistant: `;

    const completionParams = { ...paramDefaults, temperature, prompt: mergedPrompt };

    const response = await fetch(`${process.env.PRIVATE_AI_URL}/completion`, {
      method: 'POST',
      body: JSON.stringify(completionParams),
      headers: {
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      signal: controller.signal,
    });

    // @ts-ignore
    return new Response(response?.body);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
