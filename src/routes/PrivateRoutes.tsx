import { ProtectedLayout } from "layouts";
import { Home } from "pages/Home";
import { ChangePassword, Profile } from "pages/profile";
import { Call } from "pages/video";
import { Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    <ProtectedLayout>
      <Routes>
        <Route path="/call/:roomId" element={<Call />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </ProtectedLayout>
  );
};

export default PrivateRoutes;
