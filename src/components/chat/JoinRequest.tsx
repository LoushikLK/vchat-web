import { Check, Clear, Close } from "@mui/icons-material";
import { Avatar, Button, Chip, IconButton } from "@mui/material";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { RoomDataType } from "pages/video/Call";
import { toast } from "react-toastify";
import { KeyedMutator } from "swr";
import RoomType from "types/room";

const JoinRequest = ({
  closeFn,
  data,
  revalidate,
}: {
  closeFn?: () => void;
  data?: RoomType;
  revalidate?: KeyedMutator<RoomDataType>;
}) => {
  const { user, socket } = useAppState();

  const allUsers = data?.waitingUsers;

  const { mutate } = useFetch();

  const handleAccept = async (userId?: string) => {
    try {
      const res = await mutate({
        path: `room/private/join/${data?._id}/${userId}`,
        method: "PUT",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);
      toast.success(res?.data?.message);
      socket.emit("user-accepted", {
        roomId: data?._id,
        userId,
      });
      revalidate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleReject = async (userId?: string) => {
    try {
      const res = await mutate({
        path: `room/private/join/${data?._id}/${userId}`,
        method: "DELETE",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);
      toast.success(res?.data?.message);

      socket.emit("user-rejected", {
        roomId: data?._id,
        userId,
      });

      revalidate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full relative min-h-screen border-l-gray-700 shadow-lg text-white !bg-gray-800 border-l">
      <div className="flex justify-between w-full bg-theme  items-center">
        <h3 className="font-medium tracking-wide text-lg p-4  ">
          Request
          <Chip
            label={`Total (${allUsers?.length})`}
            color="primary"
            variant="filled"
          />
        </h3>
        <IconButton className="!text-white" onClick={closeFn}>
          <Close />
        </IconButton>
      </div>
      <div className="flex items-start flex-col gap-4 p-4 overflow-hidden overflow-y-auto min-h-screen h-full ">
        {allUsers
          ?.filter((inner) => inner._id !== user?._id)
          ?.map((item) => (
            <div className="flex items-center text-black !bg-white gap-4 w-full h-full justify-between  rounded-md">
              <div className="flex  items-center  p-4 gap-2" key={item?._id}>
                <Avatar
                  src={item?.photoUrl}
                  sx={{ width: 32, height: 32 }}
                  alt="student"
                  component={"image"}
                >
                  {item?.displayName[0]}
                </Avatar>
                <small className=" tracking-wide ">{item?.displayName}</small>
              </div>
              <div className="flex gap-2 h-full pr-2 ">
                <Button
                  startIcon={<Check />}
                  color="success"
                  variant="contained"
                  onClick={() => handleAccept(item?._id)}
                >
                  Accept
                </Button>
                <Button
                  startIcon={<Clear />}
                  variant="outlined"
                  color="error"
                  onClick={() => handleReject(item?._id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default JoinRequest;
