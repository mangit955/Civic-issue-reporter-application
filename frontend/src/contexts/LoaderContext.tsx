import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}
