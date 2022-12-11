import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import { useFetch } from "hooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerSchema } from "schema/registrationSchema";
import * as Yup from "yup";

const initialRegisterValue = registerSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.initialValue;
  return prev;
}, {} as any);
const registerValidation = registerSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.validationSchema;
  return prev;
}, {} as any);

const Register = () => {
  const navigate = useNavigate();

  //changing when user on register page to register component

  const { mutate } = useFetch();

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
        formData?.append("phoneNumber", values?.phoneNumber);

        const res = await mutate({
          path: "auth/user/create",
          method: "POST",
          body: formData,
          isFormData: true,
        });

        if (res?.status !== 200) throw new Error(res?.data?.error);
        toast.success(res?.data?.message);
        navigate(`/verify-email?email=${values?.email}`);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error?.message);
        }
      } finally {
        registerFormik?.resetForm();
      }
    },
  });

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
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
                value={registerFormik?.values?.name}
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
                registerFormik?.touched?.email && registerFormik?.errors?.email
              )}
            >
              <Input
                value={registerFormik?.values?.email}
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
                registerFormik?.touched?.phoneNumber &&
                  registerFormik?.errors?.phoneNumber
              )}
            >
              <Input
                value={registerFormik?.values?.phoneNumber}
                variant="filled"
                type="phoneNumber"
                placeholder="PhoneNumber"
                name="phoneNumber"
                onChange={registerFormik?.handleChange}
                onBlur={registerFormik?.handleBlur}
              />

              <FormErrorMessage>
                {registerFormik?.touched?.phoneNumber &&
                  (registerFormik?.errors?.phoneNumber as any)}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={Boolean(
                registerFormik?.touched?.password &&
                  registerFormik?.errors?.password
              )}
            >
              <Input
                value={registerFormik?.values?.password}
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
                value={registerFormik?.values?.confirmPassword}
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
              <span className="text-blue-500"> vChat's Privacy Statement </span>
              and <span className="text-blue-500">Terms of Service</span>.
            </p>{" "}
          </Checkbox>

          <button
            type="submit"
            className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md"
          >
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
              <span className="text-blue-500 hover:underline cursor-pointer font-medium text-sm">
                Login here
              </span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
