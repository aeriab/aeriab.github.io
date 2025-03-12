import { createContext, useContext, useState, ReactNode } from "react";

type NavigationState = "inProjects" | "inAbout";

type NavigationContextType = {
  currentView: NavigationState;
  navigateToProjects: () => void;
  navigateToAbout: () => void;
  toggleView: () => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<NavigationState>("inProjects");

  const navigateToProjects = () => setCurrentView("inProjects");
  const navigateToAbout = () => setCurrentView("inAbout");
  const toggleView = () => setCurrentView((prev) => 
    prev === "inProjects" ? "inAbout" : "inProjects"
  );

  return (
    <NavigationContext.Provider value={{ 
      currentView, 
      navigateToProjects, 
      navigateToAbout,
      toggleView 
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};