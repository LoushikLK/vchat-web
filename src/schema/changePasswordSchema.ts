import * as Yup from "yup";

export const changePasswordSchema = [
  {
    key: "2",
    name: "password",
    initialValue: "",
    validationSchema: Yup.string().required("Please enter a valid password*"),
  },
  {
    key: "3",
    name: "newPassword",
    initialValue: "",
    validationSchema: Yup.string()
      .min(6, "Password must be at least six character.")
      .required("Please enter a valid password*"),
  },
  {
    key: "4",
    name: "confirmPassword",
    initialValue: "",
    validationSchema: Yup.string()
      .min(6, "Password must be at least six character.")
      .required("Please enter a valid password*"),
  },
];
