import { PublicLayout } from "layouts";
import { ForgotPassword, Login, Register, VerifyEmail } from "pages/auth";
import { Route, Routes } from "react-router-dom";

const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </PublicLayout>
  );
};

export default PublicRoutes;
