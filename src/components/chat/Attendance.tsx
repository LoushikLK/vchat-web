import { AdminPanelSettings, Close, Delete } from "@mui/icons-material";
import { Avatar, Button, Chip, IconButton } from "@mui/material";
import useAppState from "context/useAppState";
import { useState } from "react";
import { toast } from "react-toastify";
import RoomType from "types/room";
import JoinRequest from "./JoinRequest";

const AttendanceDetails = ({
  data,
  closeFn,
  roomId,
}: {
  data?: RoomType;
  closeFn?: () => void;
  roomId?: string;
}) => {
  const { user } = useAppState();
  const [viewRequest, setViewRequest] = useState(false);

  const handleShareLink = async () => {
    try {
      if (!navigator.canShare) {
        toast.error(
          "Sharing link failed! Please copy the id from the header and send it to your friends"
        );
        return;
      }

      await navigator.share({
        title: "Room Link for VChat",
        text: `Hey! Join me on vChat Room by clicking this link. Copy the id:${roomId}`,
        url: window.location.href,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Sharing link failed! Please copy the id from the header and send it to your friends"
      );
    }
  };

  return (
    <>
      {viewRequest ? (
        <JoinRequest closeFn={() => setViewRequest(false)} data={data} />
      ) : (
        <div className="w-full relative min-h-screen border-l-gray-700 shadow-lg text-white !bg-gray-800 border-l">
          <div className="flex justify-between w-full bg-theme  items-center">
            <h3 className="font-medium tracking-wide text-lg p-4  ">
              People In Room{" "}
              {data?.waitingUsers?.length ? (
                <Chip
                  label={`Request (${data?.waitingUsers?.length})`}
                  color="primary"
                  variant="filled"
                  onClick={() => setViewRequest(true)}
                />
              ) : (
                <></>
              )}
            </h3>

            <IconButton className="!text-white" onClick={closeFn}>
              <Close />
            </IconButton>
          </div>
          <div className="flex items-start flex-col gap-4 p-4 overflow-hidden overflow-y-auto min-h-screen h-full ">
            <Button fullWidth variant="outlined" onClick={handleShareLink}>
              Invite
            </Button>
            {data?.joinedUsers
              ?.filter((inner) => inner._id !== user?._id)
              ?.map((item) => (
                <div className="flex items-center bg-purple-400/50 gap-4 w-full h-full justify-between  rounded-md">
                  <div
                    className="flex flex-col items-start  p-4 gap-2"
                    key={item?._id}
                  >
                    <Avatar
                      src={item?.photoUrl}
                      sx={{ width: 32, height: 32 }}
                      alt="student"
                      component={"image"}
                    >
                      {item?.displayName[0]}
                    </Avatar>
                    <small className=" tracking-wide ">
                      {item?.displayName}
                    </small>
                  </div>
                  <div className="flex gap-2 h-full pr-2 ">
                    <div className="h-20 w-20 flex items-center justify-center rounded-md shadow-lg !bg-orange-300">
                      <AdminPanelSettings />
                    </div>
                    {/* <IconButton className="h-10 w-10 !bg-purple-300">
                <VolumeMute />
              </IconButton>
              <IconButton className="h-10 w-10 !bg-purple-300">
                <VideocamOff />
              </IconButton> */}
                    <div className="h-20 w-20 flex items-center justify-center rounded-md shadow-lg !bg-red-400 ">
                      <Delete />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceDetails;
