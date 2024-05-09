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
import { message } from "./constants";

type appStateType = {
  selectedModel: string;
  engine: EngineInterface | null;
  messages: Array<message>;
  loading: boolean;
  db: IDBDatabase | null;
};

const initialState: appStateType = {
  selectedModel: "",
  engine: null,
  messages: [],
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
  UPDATE_LLM_ENGINE = "update_llm_engine",
  TOGGLE_LOADING = "toggle_loading",
  UPDATE_DB = "update_db",
  LOAD_MESSAGES = "load_messages",
  ADD_MESSAGE = "add_message",
}

type appActionsType =
  | { type: actionTypes.SELECT_MODEL; payload: string }
  | { type: actionTypes.REMOVE_MODEL }
  | { type: actionTypes.LOAD_MESSAGES; payload: Array<message> }
  | { type: actionTypes.ADD_MESSAGE; payload: message }
  | { type: actionTypes.UPDATE_LLM_ENGINE; payload: EngineInterface }
  | { type: actionTypes.TOGGLE_LOADING; payload: boolean }
  | { type: actionTypes.UPDATE_DB; payload: IDBDatabase };

function appReducer(state: appStateType, action: appActionsType) {
  switch (action.type) {
    case actionTypes.SELECT_MODEL:
      return {
        ...state,
        selectedModel: action.payload,
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
    case actionTypes.LOAD_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
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

  const { initIndexedDB, transactReadOnly } = useIndexedDB();

  useEffect(() => {
    initIndexedDB("llm-rush", 1, "messages", (db) => {
      dispatch({ type: actionTypes.UPDATE_DB, payload: db });
      if (db.objectStoreNames.contains("messages")) {
        transactReadOnly(
          db,
          "messages",
          null,
          (result) => {
            console.log(result);
            dispatch({ type: actionTypes.LOAD_MESSAGES, payload: result });
          },
          (error) => {
            console.log(error); // todo: handle properly
          }
        );
      }
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
