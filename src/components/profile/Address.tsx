import { Button, FormControl, Input } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
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
    initialValue: "Alexa",
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
    initialValue: "23049237532",
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
    initialValue: "alexacarter@gmail.com",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
  {
    key: "3",
    label: "Country Code",
    name: "countryCode",
    placeholder: "Choose Your Country",
    type: "text",
    validationSchema: Yup.string().required("required"),
    initialValue: "India",
    required: true,
    lg: "col-span-12",
  },

  {
    key: "5",
    label: "State Name",
    name: "stateName",
    placeholder: "Enter State Name",
    type: "text",
    validationSchema: Yup.string().required("required"),
    initialValue: "Demo state",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
  {
    key: "6",
    label: "City",
    name: "city",
    placeholder: "Enter City Name",
    type: "text",
    validationSchema: Yup.string().required("required"),
    initialValue: "Demo city 1",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
  {
    key: "7",
    label: "Zip Code",
    name: "zip",
    placeholder: "Enter Zip",
    type: "text",
    validationSchema: Yup.string().required("required"),
    initialValue: "423523",
    required: true,
    lg: "col-span-12 lg:col-span-6",
  },
];
const Address = () => {
  const [edit, setEdit] = useState(false);

  const handleUpdateAddress = async (values: any) => {
    console.log(values);
  };
  const [countryDetails, setCountryDetails] = useState({
    code: "GB",
    label: "United Kingdom",
    phone: "44",
  });
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
              initialValues={initialValues}
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
                            <Input
                              required={inputItem?.required}
                              placeholder={inputItem.placeholder}
                              type={inputItem.type as any}
                              className={`w-full ${
                                inputItem.type === "textArea" && "mui-multi-row"
                              }`}
                              error={Boolean(
                                props.meta.touched && props.meta.error
                              )}
                              helperText={
                                props.meta.touched && props.meta.error
                              }
                              InputProps={
                                {
                                  classes: {
                                    notchedOutline: "notchedOutline",
                                    input: "input-field",
                                  },
                                  readOnly: !edit,
                                } as any
                              }
                              {...(props.field as any)}
                            />
                          </div>
                        );
                      }}
                    </Field>
                  ))}
                  <div className="flex mt-4 col-span-12 items-center  gap-4 ">
                    {edit ? (
                      <>
                        <Button
                          className="!bg-green-500 hover:ring-green-500 "
                          onClick={() => setEdit(false)}
                        >
                          Save
                        </Button>
                        <Button
                          className="!bg-red-500 hover:ring-red-500 "
                          onClick={() => setEdit(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEdit(!edit)}>
                        {/* <Edit /> */}
                        Edit
                      </Button>
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
