import useAppState from "context/useAppState";
import { PrivateRoutes, PublicRoutes } from "routes";
import "./App.css";

function App() {
  const { user, appLoading } = useAppState();

  return (
    <>
      {appLoading ? (
        <div>Loading</div>
      ) : (
        <>{user?._id ? <PrivateRoutes /> : <PublicRoutes />}</>
      )}
    </>
  );
}

export default App;
