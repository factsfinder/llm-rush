
type model = {
    [key: string]: {
        modelName: string,
        displayName: string,
    }
}

export const models: model = {
    "llama": {
        modelName: "Llama-3-8B-Instruct-q4f16_1",
        displayName: "Llama-3-8B"
    },

    "tinyllama": {
        modelName: "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
        displayName: "TinyLlama-1.1B"
    },
    "mistral": {
        modelName: "Mistral-7B-Instruct-v0.2-q4f16_1",
        displayName: "Mistral-7B"
    },
    "phi": {
        modelName: "Phi1.5-q4f16_1-1k",
        displayName: "Phi-1.5"
    },
} 
