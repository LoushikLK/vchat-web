import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import useAppState from "context/useAppState";
import useVideoContext from "context/useVideoContext";
import { useFetch } from "hooks";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoomType from "types/room";

const Waiting = ({
  data,
  setVideoScreen,
  roomId,
}: {
  data?: RoomType;
  setVideoScreen: Dispatch<SetStateAction<boolean>>;
  roomId?: string;
}) => {
  const {
    videoTrack,
    userAudioMute,
    userVideoMute,
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
  } = useVideoContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { user, socket } = useAppState();
  const { mutate } = useFetch();

  useEffect(() => {
    let videoElementRef = videoRef.current;
    (() => {
      if (userVideoMute) return;

      console.log({ videoTrack });
      videoElementRef &&
        videoTrack?.enabled &&
        (videoElementRef.srcObject = new MediaStream([
          videoTrack?.getMediaStreamTrack(),
        ]));
    })();

    return () => {
      videoElementRef &&
        videoTrack?.enabled &&
        (videoElementRef.srcObject = null);
    };
  }, [videoTrack, userVideoMute]);

  const handleViewToastify = async (roomId: string) => {
    try {
      const res = await mutate({
        path: "room/" + roomId,
        method: "GET",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);

      toast.success(
        <div className="flex items-center gap-4 ">
          <h3 className="font-medium tracking-wide text-sm">
            You can now join
            {" " + res?.data?.data?.data?.title ||
              res?.data?.data?.data?.createdBy?.displayName + "s room"}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              color="primary"
              size={"small"}
              onClick={() => navigate(`/call/${roomId}`)}
            >
              Join
            </Button>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );

      setVideoScreen(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("room-accepted", (data: any) => {
      if (!data?.roomId) return;
      handleViewToastify(data?.roomId);
    });
    socket.on("room-rejected", (_: any) => {
      toast.error("Your request has been rejected");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleJoinRoom = async () => {
    try {
      const res = await mutate({
        path: "room/join/" + roomId,
        method: "PUT",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);

      if (data?.admin?._id === user?._id || data?.createBy?._id === user?._id) {
        navigate(`/call/${roomId}`);
        setVideoScreen(true);
        return;
      }

      if (data?.roomType === "PUBLIC") {
        navigate(`/call/${roomId}`);
        setVideoScreen(true);
        return;
      }

      socket.emit("join-waiting-room", {
        roomId: roomId,
        userId: user?._id,
      });

      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-full gap-4 items-center justify-center  max-w-5xl ">
        <div className="w-full flex-col flex items-center justify-center bg-gray-400/50 shadow-2xl px-8 pt-8 rounded-md ">
          <div className="w-full h-72 bg-gray-900 flex items-center justify-center overflow-hidden ">
            {!userVideoMute ? (
              <video autoPlay={true} ref={videoRef}></video>
            ) : (
              <VideocamOff className="!text-white" />
            )}
          </div>
          <div className="flex items-center justify-evenly pt-4 w-full">
            <IconButton
              className="h-20 w-20 "
              onClick={() => handleLocalAudioOnOff(!userAudioMute)}
            >
              {!userAudioMute ? (
                <Mic color="primary" />
              ) : (
                <MicOff color="error" />
              )}
            </IconButton>
            <IconButton
              className="h-20 w-20 "
              onClick={() => handleLocalVideoOnOff(!userVideoMute)}
            >
              {!userVideoMute ? (
                <Videocam color="primary" />
              ) : (
                <VideocamOff color="error" />
              )}
            </IconButton>
          </div>
        </div>
        <div className="w-full  p-8">
          <h1 className="text-2xl font-bold mb-4">Join Call</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0">
              <Avatar src={user?.photoUrl} alt={user?.displayName}>
                {user?.displayName[0]}
              </Avatar>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">{user?.displayName}</p>
              <p className="text-gray-500">{data?.title || "Private Room"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 flex-col">
            <p className="text-gray-800 font-semibold">
              Waiting for the meeting to start...
            </p>
            <button
              className="px-4 py-2 bg-purple-500 w-full text-white rounded hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              onClick={() => {
                handleJoinRoom();
              }}
            >
              {data?.roomType !== "PUBLIC" &&
              user?._id !== data?.admin?._id &&
              user?._id !== data?.createBy?._id
                ? "Request"
                : "Join"}
            </button>
          </div>
          <div className="text-gray-500">
            <p>Please make sure your microphone and camera are ready.</p>
            <p>
              You will be admitted once the meeting host joins or someone let
              you in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
