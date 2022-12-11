import { ProtectedLayout } from "layouts";
import { Home } from "pages/Home";
import { Call } from "pages/video";
import { Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    <ProtectedLayout>
      <Routes>
        <Route path="/call/:roomId" element={<Call />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </ProtectedLayout>
  );
};

export default PrivateRoutes;
