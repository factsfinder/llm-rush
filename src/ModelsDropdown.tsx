import { useEffect, useCallback } from "react";

import { useAppContext, actionTypes } from "./context";
import { models } from "./constants";
import useWebLLM from "./hooks/useWebLLM";

function Dropdown() {
  const { state, dispatch } = useAppContext();

  const { selectedModel } = state;

  const { loadEngine } = useWebLLM();

  const closeDropdown = useCallback((e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    const details = document.getElementById("modelsDropdown");
    const detailsList = document.getElementById("modelsDropdownList");
    if (
      details != null &&
      (!details.contains(target) || detailsList?.contains(target))
    ) {
      details.removeAttribute("open");
    }
  }, []);

  const handleSelectModel = (modelName: string) => {
    if (selectedModel !== modelName) {
      return async (e: any) => {
        closeDropdown(e);
        dispatch({ type: actionTypes.SELECT_MODEL, payload: modelName });

        const engine = await loadEngine(modelName, (report) => {
          dispatch({
            type: actionTypes.LOADING_MODEL_PROGRESS,
            payload: report,
          });
        });
        dispatch({ type: actionTypes.UPDATE_LLM_ENGINE, payload: engine });
      };
    }
  };

  useEffect(() => {
    // close dropdown when someone clicks anywhere.
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [closeDropdown]);

  return (
    <details id="modelsDropdown" className="dropdown">
      <summary className="m-1 btn btn-outline btn-md text-black">
        {selectedModel || "Load LLM"}
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
        id="modelsDropdownList"
        className="p-2 shadow-md menu dropdown-content bg-gray-100 z-[1] rounded-box w-96"
      >
        {Object.keys(models).map((m) => (
          <li
            key={m}
            className="flex flex-row flex-nowrap justify-between text-black items-center gap-2 cursor-pointer"
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
