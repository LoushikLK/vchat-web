import { ProtectedLayout } from "layouts";
import { Home } from "pages/Home";
import { Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    <ProtectedLayout>
      <Routes>
        {/* <Route path="/" element={<Call />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </ProtectedLayout>
  );
};

export default PrivateRoutes;
