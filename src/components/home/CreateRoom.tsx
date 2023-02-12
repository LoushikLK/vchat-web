import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Button colorScheme="messenger" className="!w-full" onClick={onOpen}>
        Create Room
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="w-full flex flex-col gap-4">
              <FormControl
                isInvalid={Boolean(
                  formik?.touched?.title && formik?.errors?.title
                )}
              >
                <Input
                  variant="filled"
                  placeholder="Title"
                  name="title"
                  errorBorderColor="red"
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                <FormErrorMessage>
                  {formik?.touched?.title && (formik?.errors?.title as any)}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={Boolean(
                  formik?.touched?.roomType && formik?.errors?.roomType
                )}
              >
                <Select
                  placeholder="Select option"
                  value={formik?.values?.roomType}
                  name="roomType"
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                </Select>
                <FormErrorMessage>
                  {formik?.touched?.roomType &&
                    (formik?.errors?.roomType as any)}
                </FormErrorMessage>
              </FormControl>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => formik?.handleSubmit()}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRoom;
