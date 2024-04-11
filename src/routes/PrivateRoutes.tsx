import { ProtectedLayout } from "layouts";
import { Home } from "pages/Home";
import { ChangePassword, Profile } from "pages/profile";
import { Call } from "pages/video";
import { Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/call/:roomId" element={<Call />} />
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedLayout>
            <ChangePassword />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
};

export default PrivateRoutes;
