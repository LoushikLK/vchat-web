import {
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [otpSend, setOptSend] = useState(true);

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
      <div>
        {!otpSend ? (
          <div className="w-[22rem] mt-4">
            <p className="text-xl font-semibold text-blue-600 text-left mb-4">
              Forgot Password?
            </p>
            <Stack spacing={5}>
              <Input variant="filled" placeholder="Email Address" />
            </Stack>
            <button className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md">
              Send OTP
            </button>
            <div className="flex items-center gap-2 mt-3">
              <span className="  flex items-center text-center text-sm text-gray-600">
                Do not have an account?{"  "}
              </span>
              <Link to={"/register"}>
                <span className="text-blue-500 hover:underline cursor-pointer font-medium text-sm">
                  Register here
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-[22rem] mt-4">
            <p className="text-2xl font-semibold text-blue-600 text-left mb-4">
              Enter OTP
            </p>
            <p className="text-base tracking-wide py-4 text-left">
              Please enter OTP to verify your account
            </p>
            <p className="tracking-wide text-xs text-center w-full ">
              A 6 digit OTP has been sent to your mail abscd@xyz.com
            </p>
            <HStack className="flex w-full items-center justify-center py-4">
              <PinInput type="alphanumeric">
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            <span className="py-4 text-sm tracking-wide text-red-600 cursor-pointer ">
              Resend OTP?
            </span>
            <button className="bg-gradient-to-bl  from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full px-12 mt-4 py-2 rounded-md">
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
