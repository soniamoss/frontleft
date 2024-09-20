import { useContext } from "react";
import { ExploreContext } from "@/contexts/exploreContext";

const useExplore = () => {
  const context = useContext(ExploreContext);

  if (!context) {
    throw new Error("useExplore must be used within an ExploreProvider");
  }

  const { selectedLocation, setSelectedLocation } = context;

  return {
    selectedLocation,
    setSelectedLocation,
  };
};

export default useExplore;
