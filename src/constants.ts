export type message_sender = "user" | "assistant" | "system";

export type message = {
  id: number;
  text: string;
  role: message_sender;
};

export type loadingModelType = {
  progress: number;
  text: string;
  timeElapsed: number;
};

export type model = {
  [key: string]: {
    modelName: string;
    displayName: string;
  };
};

// Todo: use webllm prebuiltAppConfig
export const models: model = {
  llama: {
    modelName: "Llama-3-8B-Instruct-q4f16_1",
    displayName: "Llama-3-8B",
  },
  tinyllama: {
    modelName: "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
    displayName: "TinyLlama-1.1B",
  },
  mistral: {
    modelName: "Mistral-7B-Instruct-v0.2-q4f16_1",
    displayName: "Mistral-7B",
  },
  phi2: {
    modelName: "Phi2-q4f16_1",
    displayName: "Phi-2",
  },
};
