import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loginSchema } from "schema/loginSchema";
import { registerSchema } from "schema/registrationSchema";
import * as Yup from "yup";

// const defaultOptions = {
//   loop: true,
//   autoplay: true,
//   animationData: HEROANIMATION,
//   rendererSettings: {
//     preserveAspectRatio: "xMidYMid slice",
//   },
// };

const initialLoginValue = loginSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.initialValue;
  return prev;
}, {} as any);
const loginValidation = loginSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.validationSchema;
  return prev;
}, {} as any);
const initialRegisterValue = registerSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.initialValue;
  return prev;
}, {} as any);
const registerValidation = registerSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.validationSchema;
  return prev;
}, {} as any);

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

  const loginFormik = useFormik({
    initialValues: initialLoginValue,
    validationSchema: Yup.object(loginValidation),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const registerFormik = useFormik({
    initialValues: initialRegisterValue,
    validationSchema: Yup.object(registerValidation),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData?.append("displayName", values?.name);
        formData?.append("email", values?.email);
        formData?.append("password", values?.password);
        formData?.append("role", "USER");
        formData?.append("confirmPassword", values?.confirmPassword);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
      {registerAccount ? (
        <form onSubmit={registerFormik?.handleSubmit}>
          <div className="w-[22rem] mt-4">
            <p className="text-4xl font-semibold text-blue-600 text-center mb-8">
              Sign Up
            </p>
            <Stack spacing={5}>
              <FormControl
                isInvalid={Boolean(
                  registerFormik?.touched?.name && registerFormik?.errors?.name
                )}
              >
                <Input
                  variant="filled"
                  placeholder="Name"
                  name="name"
                  onChange={registerFormik?.handleChange}
                  onBlur={registerFormik?.handleBlur}
                />

                <FormErrorMessage>
                  {registerFormik?.touched?.name &&
                    (registerFormik?.errors?.name as any)}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={Boolean(
                  registerFormik?.touched?.email &&
                    registerFormik?.errors?.email
                )}
              >
                <Input
                  variant="filled"
                  placeholder="Email Address"
                  name="email"
                  onChange={registerFormik?.handleChange}
                  onBlur={registerFormik?.handleBlur}
                />

                <FormErrorMessage>
                  {registerFormik?.touched?.email &&
                    (registerFormik?.errors?.email as any)}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={Boolean(
                  registerFormik?.touched?.password &&
                    registerFormik?.errors?.password
                )}
              >
                <Input
                  variant="filled"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={registerFormik?.handleChange}
                  onBlur={registerFormik?.handleBlur}
                />

                <FormErrorMessage>
                  {registerFormik?.touched?.password &&
                    (registerFormik?.errors?.password as any)}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={Boolean(
                  registerFormik?.touched?.confirmPassword &&
                    registerFormik?.errors?.confirmPassword
                )}
              >
                <Input
                  variant="filled"
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={registerFormik?.handleChange}
                  onBlur={registerFormik?.handleBlur}
                />

                <FormErrorMessage>
                  {registerFormik?.touched?.confirmPassword &&
                    (registerFormik?.errors?.confirmPassword as any)}
                </FormErrorMessage>
              </FormControl>
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
              <Link to={`/login`}>
                <span
                  className="text-blue-500 hover:underline cursor-pointer font-medium text-sm"
                  onClick={() => setRegisterAccount(false)}
                >
                  Login here
                </span>
              </Link>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={loginFormik?.handleSubmit}>
          <div className="w-[22rem] mt-4">
            <p className="text-4xl font-semibold text-blue-600 text-center mb-8">
              Sign In
            </p>
            <Stack spacing={5}>
              <FormControl
                isInvalid={Boolean(
                  loginFormik?.touched?.email && loginFormik?.errors?.email
                )}
              >
                <Input
                  variant="filled"
                  placeholder="Email Address"
                  autoCorrect="email"
                  name="email"
                  errorBorderColor="red"
                  onChange={loginFormik?.handleChange}
                  onBlur={loginFormik?.handleBlur}
                />
                <FormErrorMessage>
                  {loginFormik?.touched?.email &&
                    (loginFormik?.errors?.email as any)}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={Boolean(
                  loginFormik?.touched?.password &&
                    loginFormik?.errors?.password
                )}
              >
                <Input
                  variant="filled"
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="password"
                  onChange={loginFormik?.handleChange}
                  onBlur={loginFormik?.handleBlur}
                />
                <FormErrorMessage>
                  {loginFormik?.touched?.password &&
                    (loginFormik?.errors?.password as any)}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Link to={"/forgot-password"}>
              <p className="text-sm text-red-500 font-light mt-4 cursor-pointer">
                Forgot Password?
              </p>
            </Link>
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
        </form>
      )}
    </div>
  );
};

export default Login;
