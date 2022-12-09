import * as Yup from "yup";

export const registerSchema = [
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
      .required("Password is required*"),
  },
  {
    key: "3",
    name: "name",
    initialValue: "",
    validationSchema: Yup.string()
      .min(3, "Name must be at least six character.")
      .required("Name is required*"),
  },
  {
    key: "4",
    name: "confirmPassword",
    initialValue: "",
    validationSchema: Yup.string()
      .min(6, "Password must be at least six character.")
      .required("Password is required*")
      .oneOf(
        [Yup.ref("password"), null],
        "Password and confirm password must be same."
      ),
  },
];
