import { LOADING } from "assets/animations";
import useAppState from "context/useAppState";
import Lottie from "react-lottie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoutes, PublicRoutes } from "routes";
import "./App.css";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: LOADING,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function App() {
  const { user, appLoading } = useAppState();

  return (
    <>
      {appLoading ? (
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center  ">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
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
