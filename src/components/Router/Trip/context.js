import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  //state
  const [id, setId] = useState();
  const [userId, setUserId] = useState();

  const contextvalue = { id, setId, userId, setUserId };
  return (
    <Context.Provider value={contextvalue}>{props.children}</Context.Provider>
  );
};
