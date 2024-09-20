import React, { createContext, useState, ReactNode } from "react";

interface ExploreContextType {
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
}

export const ExploreContext = createContext<ExploreContextType | undefined>(
  undefined
);

interface ExploreProviderProps {
  children: ReactNode;
}

let logoutTimer: NodeJS.Timeout;

const ExploreProvider: React.FC<ExploreProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] =
    useState<string>("Los Angeles");

  return (
    <ExploreContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};

export default ExploreProvider;
