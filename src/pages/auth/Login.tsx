import { Checkbox, Input, Stack } from "@chakra-ui/react";
import { HEROANIMATION } from "assets/animations";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: HEROANIMATION,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Login = () => {
  const [registerAccount, setRegisterAccount] = useState(false);

  const { pathname } = useLocation();

  //changing when user on register page to register component

  useEffect(() => {
    (() => {
      let startPathName = pathname?.split("/");
      if (
        startPathName?.length &&
        startPathName?.length > 0 &&
        startPathName[1] === "register"
      ) {
        setRegisterAccount(true);
      }
    })();
  }, [pathname]);

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
      {registerAccount ? (
        <div>
          <div className="w-[22rem] mt-4">
            <p className="text-4xl font-semibold text-blue-600 text-center mb-8">
              Sign Up
            </p>
            <Stack spacing={5}>
              <Input variant="filled" placeholder="Name" />
              <Input variant="filled" placeholder="Email Address" />
              <Input variant="filled" type="password" placeholder="Password" />
              <Input
                variant="filled"
                type="password"
                placeholder="Confirm Password"
              />
            </Stack>

            <Checkbox defaultChecked className="flex items-center my-4 ">
              <p className="text-xs font-light ">
                I agree to the
                <span className="text-blue-500">
                  {" "}
                  vChat's Privacy Statement{" "}
                </span>
                and <span className="text-blue-500">Terms of Service</span>.
              </p>{" "}
            </Checkbox>

            <button className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md">
              Register
            </button>
            <p className="text-xs font-light mt-8">
              By signing in, I agree to the
              <span className="text-blue-500"> Zoom's Privacy Statement </span>
              and <span className="text-blue-500">Terms of Service</span>.
            </p>
            <div className="flex items-center gap-1 mt-3">
              <span className="  flex items-center text-center text-sm text-gray-600">
                Already have an account?
              </span>
              <span
                className="text-blue-500 hover:underline cursor-pointer font-medium text-sm"
                onClick={() => setRegisterAccount(false)}
              >
                Login here
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-[22rem] mt-4">
            <p className="text-4xl font-semibold text-blue-600 text-center mb-8">
              Sign In
            </p>
            <Stack spacing={5}>
              <Input variant="filled" placeholder="Email Address" />
              <Input variant="filled" type="password" placeholder="Password" />
            </Stack>
            <p className="text-sm text-red-500 font-light mt-4 cursor-pointer">
              Forgot Password?
            </p>
            <button className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md">
              Sign In
            </button>
            <p className="text-xs font-light mt-8">
              By signing in, I agree to the
              <span className="text-blue-500"> vChat's Privacy Statement </span>
              and <span className="text-blue-500">Terms of Service</span>.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="  flex items-center text-center text-sm text-gray-600">
                Do not have an account?{"  "}
              </span>
              <span
                className="text-blue-500 hover:underline cursor-pointer font-medium text-sm"
                onClick={() => setRegisterAccount(true)}
              >
                Register here
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
