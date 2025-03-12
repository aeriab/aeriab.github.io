import { createContext, useContext, useState, ReactNode } from "react";

type NavigationState = "inProjects" | "inAbout" | "inHome";

type NavigationContextType = {
  currentView: NavigationState;
  navigateToProjects: () => void;
  navigateToAbout: () => void;
  navigateToHome: () => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<NavigationState>("inHome");

  const navigateToProjects = () => setCurrentView("inProjects");
  const navigateToAbout = () => setCurrentView("inAbout");
  const navigateToHome = () => setCurrentView("inHome");

  return (
    <NavigationContext.Provider value={{ 
      currentView, 
      navigateToProjects, 
      navigateToAbout,
      navigateToHome,
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