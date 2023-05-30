import { createContext, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = (props) => {
  //state
  const [id, setId] = useState();

  const contextvalue = { id, setId };
  return (
    <Context.Provider value={contextvalue}>{props.children}</Context.Provider>
  );
};
