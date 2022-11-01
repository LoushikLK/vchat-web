import { PhoneIcon } from "@chakra-ui/icons";
import { Input, Stack } from "@chakra-ui/react";
import { HEROANIMATION } from "assets/animations";
import React from "react";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: HEROANIMATION,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const social = [
  { id: 1, name: "SSO" },
  { id: 2, name: "Gmail" },
  { id: 3, name: "Facebook" },
  { id: 4, name: "Apple" },
];

const Hero = () => {
  return (
    <section className="w-full h-[90vh]">
      <div className="h-full w-full flex">
        <div className="w-1/2 h-full flex justify-center items-center">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
        <div className="w-1/2 h-full flex justify-center items-center">
          <div>
            <div className="w-[22rem] mt-4">
              <p className="text-2xl font-semibold text-blue-600 text-center mb-4">
                Sign Up
              </p>
              <Stack spacing={3}>
                <Input variant="filled" placeholder="Email Address" />
                <Input
                  variant="filled"
                  type="password"
                  placeholder="Password"
                />
              </Stack>
              <p className="text-sm text-red-500 font-light mt-4 cursor-pointer">
                Forgot Password?
              </p>
              <button className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md">
                Sign In
              </button>
              <p className="text-xs font-light mt-8">
                By signing in, I agree to the
                <span className="text-blue-500">
                  {" "}
                  Zoom's Privacy Statement{" "}
                </span>
                and <span className="text-blue-500">Terms of Service</span>.
              </p>
              <div className="flex items-center mt-3">
                <div className="border-b-[1px] border-gray-300 w-full"></div>
                <div>
                  <p className="w-32 text-center text-sm text-gray-600">
                    Or sign in with
                  </p>
                </div>
                <div className="border-b-[1px] border-gray-300 w-full"></div>
              </div>
              <div className="mt-4 flex">
                {social.map((item) => (
                  <div
                    className="w-1/4 flex flex-col justify-center items-center py-2"
                    key={item?.id}
                  >
                    <div className="h-14 w-14 border-2 rounded-md flex justify-center items-center">
                      <PhoneIcon />
                    </div>
                    <p className="font-semibold text-gray-600 text-sm mt-2 text-center">
                      {item?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
