import useAppState from "context/useAppState";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoutes, PublicRoutes } from "routes";
import "./App.css";

function App() {
  const { user, appLoading } = useAppState();

  return (
    <>
      {appLoading ? (
        <div>Loading</div>
      ) : (
        <>
          {user?._id ? <PrivateRoutes /> : <PublicRoutes />}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
          />
        </>
      )}
    </>
  );
}

export default App;
