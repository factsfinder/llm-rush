import * as webllm from "@mlc-ai/web-llm";

function useWebLLM() {
  const loadEngine = async (
    modelName: string,
    progressCallback: (report: webllm.InitProgressReport) => void
  ) => {
    const appConfig = {
      ...webllm.prebuiltAppConfig,
      useIndexedDBCache: true,
    };
    return await webllm.CreateWebWorkerEngine(
      new Worker(new URL("../worker.ts", import.meta.url), {
        type: "module",
      }),
      modelName,
      {
        initProgressCallback: (report: webllm.InitProgressReport) => {
          progressCallback(report);
        },
        appConfig,
      }
    );
  };

  const stream = async (
    engine: webllm.EngineInterface,
    userMsg: string,
    answerCallback: (message: string) => void
  ) => {
    const request: webllm.ChatCompletionRequest = {
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "I am a helpful, respectful and honest assistant. " +
            "I will try to answer corectly to every question.",
        },
        { role: "user", content: userMsg },
      ],
      temperature: 0.5,
      max_gen_len: 512,
    };

    const asyncChunkGenerator = await engine.chat.completions.create(request);
    let message = "";

    for await (const chunk of asyncChunkGenerator) {
      if (chunk.choices[0].delta.content) {
        // Last chunk has undefined content
        message += chunk.choices[0].delta.content;
        answerCallback(message);
      }
      // engine.interruptGenerate();  // works with interrupt as well
      // console.log(await engine.runtimeStatsText());
    }
  };

  return { loadEngine, stream };
}

export default useWebLLM;
