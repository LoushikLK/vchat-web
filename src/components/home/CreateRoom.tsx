import {
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import useAppState from "context/useAppState";
import { useFormik } from "formik";
import { useFetch } from "hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as Yup from "yup";

const initialValue = {
  roomType: "",
  title: "",
};

const validationSchema = Yup.object({
  roomType: Yup.string().required("Room type is required"),
  title: Yup.string(),
});

const CreateRoom = () => {
  const { mutate } = useFetch();
  const navigation = useNavigate();

  const { socket } = useAppState();

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (value) => {
      try {
        const res = await mutate({
          path: "room/create",
          method: "POST",
          body: JSON.stringify({
            roomType: value?.roomType,
            title: value?.title,
          }),
        });
        if (res?.status !== 200) throw new Error(res?.data?.error);
        toast.success(res?.data?.message);
        socket.emit("room-created", {
          roomId: res?.data?.data?.data?._id,
        });
        navigation(`/call/${res?.data?.data?.data?._id}`);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    },
  });

  return (
    <>
      <div className="w-full p-4 shadow-xl rounded-xl bg-white">
        <h3 className="font-medium tracking-wide text-4xl p-4 text-center text-blue-800">
          Create New Call
        </h3>

        <div className="w-full p-4">
          <div className="w-full flex flex-col gap-4">
            <FormControl>
              <TextField
                variant="outlined"
                placeholder="Title"
                name="title"
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              />
              <FormHelperText>
                {formik?.touched?.title && (formik?.errors?.title as any)}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <Select
                placeholder="Select option"
                value={formik?.values?.roomType}
                name="roomType"
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              >
                <MenuItem value="PRIVATE">Private</MenuItem>
                <MenuItem value="PUBLIC">Public</MenuItem>
              </Select>
              <FormHelperText>
                {formik?.touched?.roomType && (formik?.errors?.roomType as any)}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 w-full">
          <Button
            variant="contained"
            className="!bg-blue-600 !text-white"
            onClick={() => formik?.handleSubmit()}
          >
            Create
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateRoom;
