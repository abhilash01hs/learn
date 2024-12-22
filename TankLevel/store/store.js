import React, { createContext, useState, useContext } from "react";

// Create a Context for the variable
const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
	const [fmcToken, setFmcToken] = useState("");

	return (
		<StoreContext.Provider value={{ fmcToken, setFmcToken }}>
			{children}
		</StoreContext.Provider>
	);
};

// Custom hook for using the context value in any component
export const useStore = () => useContext(StoreContext);
