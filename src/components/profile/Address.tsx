import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
} from "@chakra-ui/react";
import useAppState from "context/useAppState";
import { Field, Form, Formik } from "formik";
import { useFetch } from "hooks";
import { Dispatch, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const ProfileInfoSchema = [
  {
    key: "1",
    label: "Name",
    name: "name",
    placeholder: "Enter Your Name",
    type: "text",
    validationSchema: Yup.string()
      .required("required")
      .min(2, "Name must be at least 2 characters"),
    initialValue: "",
    required: true,
    lg: "col-span-6",
  },
  {
    key: "2",
    label: "Phone Number",
    name: "phone",
    placeholder: "Enter Your Phone Number",
    type: "number",
    validationSchema: Yup.number().required("required"),
    initialValue: "",
    required: true,
    lg: "col-span-6",
  },
  {
    key: "4",
    label: "Email",
    name: "email",
    placeholder: "Enter Email Address",
    type: "email",
    validationSchema: Yup.string()
      .required("required")
      .email("Invalid Email Address"),
    initialValue: "",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
  {
    key: "5",
    label: "Gender",
    name: "gender",
    placeholder: "Choose Gender",
    type: "select",
    validationSchema: Yup.string().required("required"),
    initialValue: "",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
  {
    key: "6",
    label: "Date Of Birth",
    name: "dateOfBirth",
    placeholder: "Choose Date Of Birth",
    type: "date",
    validationSchema: Yup.string(),
    initialValue: "",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
];
const Address = ({
  setUserImage,
  userImage,
}: {
  userImage: any;
  setUserImage: Dispatch<any>;
}) => {
  const { user } = useAppState();

  const { mutate } = useFetch();

  const [edit, setEdit] = useState(false);

  const handleUpdateAddress = async (values: any) => {
    try {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            const formData = new FormData();
            formData?.append("photo", userImage);
            formData?.append("displayName", values?.name);
            formData?.append("gender", values?.gender);
            formData?.append("dateOfBirth", values?.dateOfBirth);
            formData?.append("phoneNumber", values?.phone);

            const res = await mutate({
              path: "update-profile",
              method: "PUT",
              body: formData,
              isFormData: true,
            });

            if (res?.status !== 200) throw new Error(res?.data?.error);
            setEdit(false);

            resolve(res);
          } catch (error) {
            reject(error);
          }
        }),
        {
          pending: "Updating user data...",
          success: "User updated successfully",
          error: "Data update failed",
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const initialValues = ProfileInfoSchema.reduce(
    (accumulator: any, currentValue: any) => {
      accumulator[currentValue?.name] = currentValue.initialValue;
      return accumulator;
    },
    {} as { [key: string]: string }
  );
  const validationSchema = ProfileInfoSchema.reduce(
    (accumulator: any, currentValue: any) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {} as { [key: string]: Yup.StringSchema }
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
      <p className="font-semibold text-themeDarkBlue text-2xl pt-5 px-5 border-b">
        Account Settings
      </p>
      <div className="px-5 pb-6">
        <FormControl sx={{ width: "100%" }}>
          <div className="flex flex-col w-full pt-8 gap-3">
            <Formik
              enableReinitialize
              initialValues={{
                ...initialValues,
                name: user?.displayName,
                email: user?.email,
                phone: user?.phoneNumber,
                gender: user?.gender,
                dateOfBirth: user?.dateOfBirth,
              }}
              validationSchema={Yup.object(validationSchema)}
              onSubmit={handleUpdateAddress}
            >
              {(formik) => (
                <Form className="grid grid-cols-12 gap-3">
                  {ProfileInfoSchema.map((inputItem) => (
                    <Field name={inputItem.name} key={inputItem.key}>
                      {(props: {
                        meta: { touched: any; error: any };
                        field: any;
                      }) => {
                        return (
                          <div className={`w-full ${inputItem?.lg}`}>
                            <p className="tracking-wider font-semibold pb-2">
                              {inputItem.label}
                            </p>
                            <FormControl
                              isInvalid={Boolean(
                                props.meta.touched && props.meta.error
                              )}
                            >
                              {inputItem?.type === "select" ? (
                                <Select
                                  placeholder="Select Gender"
                                  name={inputItem?.name}
                                  errorBorderColor="red"
                                  onChange={formik?.handleChange}
                                  onBlur={formik?.handleBlur}
                                  value={props?.field?.value}
                                  isReadOnly={!edit}
                                  isDisabled={!edit}
                                >
                                  <option value="MALE">Male</option>
                                  <option value="FEMALE">Female</option>
                                  <option value="OTHER">Other</option>
                                  <option value="NONE">Not Specified</option>
                                </Select>
                              ) : (
                                <Input
                                  variant="filled"
                                  placeholder={inputItem.placeholder}
                                  type={inputItem.type as any}
                                  name={inputItem?.name}
                                  errorBorderColor="red"
                                  onChange={props?.field?.onChange}
                                  onBlur={props?.field?.onBlur}
                                  value={props?.field?.value}
                                  isReadOnly={
                                    inputItem?.name === "email" ? true : !edit
                                  }
                                />
                              )}

                              <FormErrorMessage>
                                {props.meta.touched && props.meta.error}
                              </FormErrorMessage>
                            </FormControl>
                          </div>
                        );
                      }}
                    </Field>
                  ))}
                  <div className="flex mt-4 col-span-12 items-center  gap-4 ">
                    {edit ? (
                      <>
                        <Button
                          className="!bg-green-500 hover:ring-green-500  !text-white "
                          onClick={() => formik?.handleSubmit()}
                        >
                          Save
                        </Button>
                        <Button
                          className="!bg-red-500 hover:ring-red-500 !text-white "
                          onClick={() => setEdit(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEdit(!edit)}>Edit</Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

export default Address;
