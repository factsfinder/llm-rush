import { EngineInterface } from "@mlc-ai/web-llm";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";

import useIndexedDB from "./hooks/useIndexedDB";

type message_sender = "user" | "assistant" | "system";

type message = {
  timestamp: number; // note: will serve as unique id of the msg
  text: string;
  kind: message_sender;
};

type loadingModelType = {
  progress: number;
  text: string;
  timeElapsed: number;
};

type appStateType = {
  selectedModel: string;
  engine: EngineInterface | null;
  messages: Array<message>;
  answer: string | null; // todo: remove after handling multiple messages
  loadingModelProgress: loadingModelType | null;
  loading: boolean;
  db: IDBDatabase | null;
};

const initialState: appStateType = {
  selectedModel: "",
  engine: null,
  messages: [],
  answer: null, // todo: remove after handling multiple messages
  loadingModelProgress: null,
  loading: false,
  db: null,
};

type appContextType = {
  state: appStateType;
  dispatch: Dispatch<any>;
};

const AppContext = createContext<appContextType>({
  state: initialState,
  dispatch: () => null,
});

enum actionTypes {
  SELECT_MODEL = "select_model",
  REMOVE_MODEL = "remove_model",
  UPDATE_MSG_RESPONSE = "update_msg_response",
  UPDATE_LLM_ENGINE = "update_llm_engine",
  UPDATE_ANSWER = "update_answer",
  TOGGLE_LOADING = "toggle_loading",
  UPDATE_DB = "update_db",
  LOADING_MODEL_PROGRESS = "loading_model_progress",
}

type appActionsType =
  | { type: actionTypes.SELECT_MODEL; payload: string }
  | { type: actionTypes.REMOVE_MODEL }
  | { type: actionTypes.UPDATE_MSG_RESPONSE; payload: string; msg_id: number }
  | { type: actionTypes.UPDATE_ANSWER; payload: string }
  | { type: actionTypes.UPDATE_LLM_ENGINE; payload: EngineInterface }
  | { type: actionTypes.TOGGLE_LOADING; payload: boolean }
  | { type: actionTypes.UPDATE_DB; payload: IDBDatabase }
  | {
      type: actionTypes.LOADING_MODEL_PROGRESS;
      payload: loadingModelType | null;
    };

function appReducer(state: appStateType, action: appActionsType) {
  switch (action.type) {
    case actionTypes.SELECT_MODEL:
      return {
        ...state,
        selectedModel: action.payload,
      };
    case actionTypes.LOADING_MODEL_PROGRESS:
      return {
        ...state,
        loadingModelProgress: action.payload,
      };
    case actionTypes.TOGGLE_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actionTypes.UPDATE_DB:
      return {
        ...state,
        db: action.payload,
      };
    case actionTypes.UPDATE_LLM_ENGINE:
      return {
        ...state,
        engine: action.payload,
      };
    case actionTypes.UPDATE_MSG_RESPONSE:
      // todo: based on action.id updaate the msg response
      return {
        ...state,
      };
    case actionTypes.UPDATE_ANSWER:
      return {
        ...state,
        answer: action.payload,
      };
    case actionTypes.REMOVE_MODEL:
      return {
        ...state,
        selectedModel: "",
      };

    default:
      return { ...state };
  }
}

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const { initDB } = useIndexedDB();

  console.log(state.db);
  useEffect(() => {
    initDB("llm-rush", 1, (db) => {
      dispatch({ type: actionTypes.UPDATE_DB, payload: db });
    });
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  return useContext(AppContext);
}

export { useAppContext, AppProvider, AppContext, actionTypes };
