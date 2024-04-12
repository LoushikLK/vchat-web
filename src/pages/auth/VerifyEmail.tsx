import { TextField } from "@mui/material";
import { useFetch } from "hooks";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [pinValue, setPinValue] = useState("");

  const [search] = useSearchParams();

  let email = search?.get("email");

  const { mutate } = useFetch();

  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    try {
      if (!pinValue || pinValue?.length < 6)
        throw new Error("Pin value must be at least 6 characters!");

      if (!email) throw new Error("Email does not exist! ");

      const formData = new FormData();

      formData?.append("email", email);
      formData?.append("OTP", pinValue);

      const res = await mutate({
        path: "auth/send-email/verify",
        method: "POST",
        body: formData,
        isFormData: true,
      });

      if (res?.status !== 200) throw new Error(res?.data?.error);
      toast.success(res?.data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error?.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
      <div className="w-[22rem] mt-4">
        <p className="text-2xl font-semibold text-purple-600 text-left mb-4">
          Enter OTP
        </p>
        <p className="text-base tracking-wide py-4 text-left">
          Please enter OTP to verify your account
        </p>
        <p className="tracking-wide text-xs text-center w-full ">
          A 6 digit OTP has been sent to your mail {email || "xxxxx@xx.com"}
        </p>
        <TextField
          type="number"
          value={pinValue}
          onChange={(e) => setPinValue(e?.target?.value?.trim())}
          fullWidth
          label="Enter OTP"
          variant="outlined"
          size="small"
          className="!mt-4"
        />

        <button
          disabled={!pinValue}
          className="bg-gradient-to-bl  from-purple-400 to-purple-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full px-12 mt-4 py-2 rounded-md"
          onClick={handleVerifyEmail}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
