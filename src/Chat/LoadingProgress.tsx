function LoadingProgress() {
  return (
    <div
      id="loadingProgress"
      className="flex flex-col gap-2 justify-center max-w-[500px] py-2"
    >
      <p id="loadingProgressText" className="text-primary text-center"></p>
      <progress
        id="loadingProgressBar"
        className="hidden progress progress-primary w-56 mx-auto"
        max="100"
      ></progress>
    </div>
  );
}

export default LoadingProgress;
