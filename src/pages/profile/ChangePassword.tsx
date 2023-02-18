import {
  Avatar,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
} from "@chakra-ui/react";
import useAppState from "context/useAppState";
import { useFormik } from "formik";
import { useFetch } from "hooks";
import { toast } from "react-toastify";
import { changePasswordSchema } from "schema/changePasswordSchema";
import { formatDate } from "utils";
import * as Yup from "yup";

const initialLoginValue = changePasswordSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.initialValue;
  return prev;
}, {} as any);
const loginValidation = changePasswordSchema.reduce((prev, curr) => {
  prev[curr?.name] = curr.validationSchema;
  return prev;
}, {} as any);

const ChangePassword = () => {
  // const navigate = useNavigate();

  const { user } = useAppState();

  const { mutate } = useFetch();

  const formik = useFormik({
    initialValues: initialLoginValue,
    validationSchema: Yup.object(loginValidation),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData?.append("oldPassword", values?.password);
        formData?.append("newPassword", values?.newPassword);
        formData?.append("confirmPassword", values?.confirmPassword);

        const res = await mutate({
          path: "auth/change-password",
          method: "POST",
          body: formData,
          isFormData: true,
        });

        if (res?.status !== 200) throw new Error(res?.data?.error);
        toast.success(res?.data?.message);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error?.message);
        }
      } finally {
        formik?.resetForm();
      }
    },
  });

  return (
    <section className="w-full mb-10 container mx-auto ">
      <div className="w-full h-52 relative">
        <div className="main-container absolute top-1/2 w-full flex left-0 right-0 items-center justify-center py-6 md:py-10">
          <div className="w-full flex justify-center gap-8">
            <div className=" max-w-md w-full rounded-xl">
              <div className="w-full flex gap-2 flex-col items-center bg-white justify-center rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] border pt-8 pb-5">
                <Avatar
                  src={user?.photoUrl}
                  sx={{ width: "7rem", height: "7rem" }}
                />
                <div className="flex flex-col text-center justify-center items-center w-full">
                  <p className="text-xl font-semibold">{user?.displayName}</p>
                  <p className="text-theme">{user?.email}</p>
                </div>
                <div className="flex flex-col w-full pt-4">
                  <div
                    className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
                  >
                    <p className=" font-semibold ">Joined</p>
                    <p className=" font-semibold text-sm">
                      {user?.createdAt
                        ? formatDate(user?.createdAt)
                        : "Unknown"}
                    </p>
                  </div>
                  <div
                    className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
                  >
                    <p className=" font-semibold ">Email Verified</p>
                    <p className=" font-semibold text-sm">
                      {user?.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-md w-full p-4 bg-white rounded-xl ">
              <div className="w-full h-full flex justify-center items-center">
                <form onSubmit={formik?.handleSubmit}>
                  <div className="w-[22rem] mt-4">
                    <p className="text-2xl font-semibold text-blue-600 text-center mb-8">
                      Change Your Password
                    </p>
                    <Stack spacing={5}>
                      <FormControl
                        isInvalid={Boolean(
                          formik?.touched?.password && formik?.errors?.password
                        )}
                      >
                        <Input
                          variant="filled"
                          type="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="password"
                          onChange={formik?.handleChange}
                          onBlur={formik?.handleBlur}
                          value={formik?.values?.password}
                        />
                        <FormErrorMessage>
                          {formik?.touched?.password &&
                            (formik?.errors?.password as any)}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={Boolean(
                          formik?.touched?.newPassword &&
                            formik?.errors?.newPassword
                        )}
                      >
                        <Input
                          variant="filled"
                          type="password"
                          name="newPassword"
                          placeholder="New Password"
                          onChange={formik?.handleChange}
                          onBlur={formik?.handleBlur}
                          value={formik?.values?.newPassword}
                        />
                        <FormErrorMessage>
                          {formik?.touched?.newPassword &&
                            (formik?.errors?.newPassword as any)}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={Boolean(
                          formik?.touched?.confirmPassword &&
                            formik?.errors?.confirmPassword
                        )}
                      >
                        <Input
                          variant="filled"
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          onChange={formik?.handleChange}
                          onBlur={formik?.handleBlur}
                          value={formik?.values?.confirmPassword}
                        />
                        <FormErrorMessage>
                          {formik?.touched?.confirmPassword &&
                            (formik?.errors?.confirmPassword as any)}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>

                    <button
                      type="submit"
                      className="bg-gradient-to-bl from-blue-400 to-blue-600 ease-in-out duration-200 hover:bg-gradient-to-r hover:scale-105 transition-all text-white w-full mt-4 py-2 rounded-md"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
