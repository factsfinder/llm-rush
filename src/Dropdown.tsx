import { useState, useEffect } from "react";

import { models } from "./constants";

function Dropdown() {
  const [selectedModel, setSelectedModal] = useState("");

  useEffect(() => {
    // close html details tag when someone clicks anywhere.
    const closeDetailsTag = () => {
      const details = document.querySelectorAll("details");
      details.forEach((f) => f.removeAttribute("open"));
    };
    document.addEventListener("click", closeDetailsTag);
    return () => {
      document.removeEventListener("click", closeDetailsTag);
    };
  }, []);

  return (
    <details className="dropdown">
      <summary tabIndex={0} role="button" className="m-1">
        {selectedModel || "Models"}
      </summary>
      <ul
        tabIndex={0}
        className="p-2 shadow menu dropdown-content z-[1] rounded-box"
      >
        {Object.keys(models).map((m) => (
          <div className="flex flex-row w-full" onClick={() => setSelectedModal(models[m].modelName)}>
                <p className="font-bold">{models[m].displayName}:</p> 
                <p className="">{models[m].modelName}</p>
          </div>
        ))}
      </ul>
    </details>
  );
}

export default Dropdown;
