import { PublicLayout } from "layouts";
import { ForgotPassword, Login } from "pages/auth";
import { Route, Routes } from "react-router-dom";

const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </PublicLayout>
  );
};

export default PublicRoutes;
