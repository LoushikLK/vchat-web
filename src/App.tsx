import { AppContextProvider } from "context/useAppState";
import { PrivateRoutes } from "routes";
import "./App.css";

function App() {
  return (
    <AppContextProvider>
      <PrivateRoutes />
    </AppContextProvider>
  );
}

export default App;
