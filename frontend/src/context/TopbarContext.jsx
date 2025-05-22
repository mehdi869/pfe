import React, { createContext, useState, useContext, useCallback } from 'react';

const TopbarContext = createContext();

export const useTopbar = () => useContext(TopbarContext);

export const TOPBAR_HEIGHT = '64px'; // Define a consistent height

export const TopbarProvider = ({ children }) => {
  const [isTopbarExternallyControlled, setIsTopbarExternallyControlled] = useState(false);
  const [isTopbarCollapsed, setIsTopbarCollapsed] = useState(false);

  const setTopbarConfig = useCallback((isControlled, initialCollapsedState = false) => {
    setIsTopbarExternallyControlled(isControlled);
    setIsTopbarCollapsed(isControlled ? initialCollapsedState : false);
  }, []);

  const toggleTopbar = useCallback((forceState) => {
    if (isTopbarExternallyControlled) {
      setIsTopbarCollapsed(prevState => typeof forceState === 'boolean' ? forceState : !prevState);
    }
  }, [isTopbarExternallyControlled]);

  return (
    <TopbarContext.Provider value={{ isTopbarExternallyControlled, isTopbarCollapsed, setTopbarConfig, toggleTopbar }}>
      {children}
    </TopbarContext.Provider>
  );
};