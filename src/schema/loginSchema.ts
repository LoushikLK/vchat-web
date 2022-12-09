import * as Yup from "yup";

export const loginSchema = [
  {
    key: "1",
    name: "email",
    initialValue: "",
    validationSchema: Yup.string()
      .email("Please enter a valid email.")
      .required("Email is required*"),
  },
  {
    key: "2",
    name: "password",
    initialValue: "",
    validationSchema: Yup.string()
      .min(6, "Password must be at least six character.")
      .required("Please enter a valid password*"),
  },
];
