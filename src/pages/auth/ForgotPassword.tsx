import { FormHelperText, TextField } from "@mui/material";
import { useFetch } from "hooks";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [otpSend, setOptSend] = useState(false);
  const [email, setEmail] = useState("");
  const [emailRequired, setEmailRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);

  const { mutate } = useFetch();

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      if (!email) {
        setEmailRequired(true);
        return;
      }

      setEmailRequired(false);

      const response = await mutate({
        path: "auth/forgot-password",
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (response?.data?.error) throw new Error(response?.data?.error);
      toast.success(response?.data?.message);
      setOptSend(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        setOtpRequired(true);
        return;
      }

      setOtpRequired(false);

      if (!password) {
        setPasswordRequired(true);
        return;
      }

      setPasswordRequired(false);

      const response = await mutate({
        path: "auth/forgot-password/verify-otp",
        method: "POST",
        body: JSON.stringify({
          email,
          OTP: otp,
          newPassword: password,
          confirmPassword: password,
        }),
      });
      if (response?.data?.error) throw new Error(response?.data?.error);
      toast.success(response?.data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
      <div>
        {!otpSend ? (
          <div className="w-[22rem] mt-4">
            <p className="text-xl font-semibold text-purple-600 text-left mb-4">
              Forgot Password?
            </p>

            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
            />
            <FormHelperText error>
              {emailRequired && "Email is required"}
            </FormHelperText>
            <button
              onClick={handleSendOtp}
              className="bg-gradient-to-bl from-purple-400 to-purple-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md"
            >
              Send OTP
            </button>
            <div className="flex items-center gap-2 mt-3">
              <span className="  flex items-center text-center text-sm text-gray-600">
                Do not have an account?{"  "}
              </span>
              <Link to={"/register"}>
                <span className="text-purple-500 hover:underline cursor-pointer font-medium text-sm">
                  Register here
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-[22rem] mt-4">
            <p className="text-2xl font-semibold text-purple-600 text-left mb-4">
              Enter OTP
            </p>
            <p className="text-base tracking-wide py-4 text-left">
              Please enter OTP to verify your account
            </p>
            <p className="tracking-wide text-xs text-center w-full ">
              A 6 digit OTP has been sent to your email {email || ""}
            </p>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              type="number"
              className="!mt-4"
            />
            <FormHelperText error>
              {otpRequired && "OTP is required"}
            </FormHelperText>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="text"
              className="!mt-4"
            />
            <FormHelperText error>
              {passwordRequired && "Password is required"}
            </FormHelperText>
            <span
              className="py-4 text-sm tracking-wide text-red-600 cursor-pointer "
              onClick={handleSendOtp}
            >
              Resend OTP?
            </span>
            <button
              className="bg-gradient-to-bl  from-purple-400 to-purple-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full px-12 mt-4 py-2 rounded-md"
              onClick={handleVerifyOtp}
            >
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
