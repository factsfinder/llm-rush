import { useState, useEffect, useCallback } from "react";

import { models } from "./constants";

function Dropdown({ id }: { id: string }) {
  const [selectedModel, setSelectedModal] = useState("");

  const closeDetailsTag = useCallback(
    (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      const details = document.getElementById(id);
      const detailsList = document.getElementById("modelsdropdownlist");
      if (
        details != null &&
        (!details.contains(target) || detailsList?.contains(target))
      ) {
        details.removeAttribute("open");
      }
    },
    [id]
  );

  const handleSelectModel = (modelName: string) => {
    return (e: any) => {
      setSelectedModal(modelName);
      closeDetailsTag(e);
    };
  };

  useEffect(() => {
    // close html details tag when someone clicks anywhere.
    document.addEventListener("click", closeDetailsTag);
    return () => {
      document.removeEventListener("click", closeDetailsTag);
    };
  }, [closeDetailsTag]);

  return (
    <details id={id} className="dropdown">
      <summary className="m-1 btn btn-outline btn-sm text-black">
        {selectedModel || "Select LLM"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </summary>
      <ul
        id="modelsdropdownlist"
        className="p-2 shadow menu dropdown-content z-[1] rounded-box w-96"
      >
        {Object.keys(models).map((m) => (
          <li
            key={m}
            className="flex flex-row flex-nowrap justify-between items-center gap-2 cursor-pointer"
            onClick={handleSelectModel(models[m].modelName)}
          >
            <a>
              <b>{models[m].displayName}:</b> {models[m].modelName}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default Dropdown;
