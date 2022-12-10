import { FormControl, FormErrorMessage, Input, Stack } from "@chakra-ui/react";
import useAppState from "context/useAppState";

import { useFormik } from "formik";
import { useFetch } from "hooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSchema } from "schema/loginSchema";
import * as Yup from "yup";

const initialLoginValue = loginSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.initialValue;
  return prev;
}, {} as any);
const loginValidation = loginSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.validationSchema;
  return prev;
}, {} as any);

const Login = () => {
  const { setUser } = useAppState();

  const navigate = useNavigate();

  const { mutate } = useFetch();

  const loginFormik = useFormik({
    initialValues: initialLoginValue,
    validationSchema: Yup.object(loginValidation),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData?.append("password", values?.password);
        formData?.append("email", values?.email);

        const res = await mutate({
          path: "auth/login",
          method: "POST",
          body: formData,
          isFormData: true,
        });

        if (res?.status !== 200) throw new Error(res?.data?.error);
        toast.success(res?.data?.message);

        setUser(res?.data?.data);

        navigate(`/`);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error?.message);
        }
      } finally {
        loginFormik?.resetForm();
      }
    },
  });

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
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
                loginFormik?.touched?.password && loginFormik?.errors?.password
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
          <button
            type="submit"
            className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md"
          >
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
            <Link to="/register">
              <span className="text-blue-500 hover:underline cursor-pointer font-medium text-sm">
                Register here
              </span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
