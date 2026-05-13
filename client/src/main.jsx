import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authapi"; 

// Shows loading screen while auth state is being resolved on page load
const AppInitializer = ({ children }) => {
  const { isLoading } = useLoadUserQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <AppInitializer>
        <App />
      </AppInitializer>
      <Toaster />
    </Provider>
  </StrictMode>,
);
