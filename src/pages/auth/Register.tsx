import {
  Checkbox,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useFetch } from "hooks";
import { useState } from "react";
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
  const [isAgree, setIsAgree] = useState(true);

  //changing when user on register page to register component

  const { mutate } = useFetch();

  const registerFormik = useFormik({
    initialValues: initialRegisterValue,
    validationSchema: Yup.object(registerValidation),
    onSubmit: async (values) => {
      try {
        if (!isAgree) {
          toast.error("Please agree with our terms and conditions");
          return;
        }

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
          <p className="text-4xl font-semibold text-purple-600 text-center mb-8">
            Sign Up
          </p>
          <div className="flex flex-col gap-4 w-full">
            <FormControl className="w-full flex flex-col ">
              <TextField
                value={registerFormik?.values?.name}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Name"
                name="name"
                onChange={registerFormik?.handleChange}
                onBlur={registerFormik?.handleBlur}
              />

              <FormHelperText error>
                {registerFormik?.touched?.name &&
                  (registerFormik?.errors?.name as any)}
              </FormHelperText>
            </FormControl>
            <FormControl className="w-full flex flex-col ">
              <TextField
                value={registerFormik?.values?.email}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Email Address"
                name="email"
                onChange={registerFormik?.handleChange}
                onBlur={registerFormik?.handleBlur}
              />

              <FormHelperText error>
                {registerFormik?.touched?.email &&
                  (registerFormik?.errors?.email as any)}
              </FormHelperText>
            </FormControl>
            <FormControl className="w-full flex flex-col ">
              <TextField
                value={registerFormik?.values?.phoneNumber}
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                placeholder="PhoneNumber"
                name="phoneNumber"
                onChange={registerFormik?.handleChange}
                onBlur={registerFormik?.handleBlur}
              />

              <FormHelperText error>
                {registerFormik?.touched?.phoneNumber &&
                  (registerFormik?.errors?.phoneNumber as any)}
              </FormHelperText>
            </FormControl>
            <FormControl className="w-full flex flex-col ">
              <TextField
                value={registerFormik?.values?.password}
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                placeholder="Password"
                name="password"
                onChange={registerFormik?.handleChange}
                onBlur={registerFormik?.handleBlur}
              />

              <FormHelperText error>
                {registerFormik?.touched?.password &&
                  (registerFormik?.errors?.password as any)}
              </FormHelperText>
            </FormControl>
            <FormControl className="w-full flex flex-col ">
              <TextField
                value={registerFormik?.values?.confirmPassword}
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={registerFormik?.handleChange}
                onBlur={registerFormik?.handleBlur}
              />

              <FormHelperText error>
                {registerFormik?.touched?.confirmPassword &&
                  (registerFormik?.errors?.confirmPassword as any)}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="flex gap-2 mt-4">
            <Checkbox
              defaultChecked
              className="flex items-center my-4 "
              checked={isAgree}
              onClick={() => setIsAgree(!isAgree)}
            />
            <p className="text-xs font-light ">
              I agree to the
              <span className="text-purple-500">
                {" "}
                vChat's Privacy Statement{" "}
              </span>
              and <span className="text-purple-500">Terms of Service</span>.
            </p>{" "}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-bl from-purple-400 to-purple-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md"
          >
            Register
          </button>

          <div className="flex items-center gap-1 mt-3">
            <span className="  flex items-center text-center text-sm text-gray-600">
              Already have an account?
            </span>
            <Link to={`/login`}>
              <span className="text-purple-500 hover:underline cursor-pointer font-medium text-sm">
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
