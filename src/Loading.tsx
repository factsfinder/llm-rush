function Loading() {
  return (
    <div
      id="loading-screen"
      className="flex justify-center w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50"
    >
      <span className="loading loading-spinner loading-lg self-center" />
    </div>
  );
}

export default Loading;
