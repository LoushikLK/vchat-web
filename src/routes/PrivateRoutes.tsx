import { Call } from "pages/video";
import { Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    // <ProtectedLayout>
    <Routes>
      <Route path="/" element={<Call />} />
    </Routes>
    // </ProtectedLayout>
  );
};

export default PrivateRoutes;
