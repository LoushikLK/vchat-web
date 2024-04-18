import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import useAppState from "context/useAppState";
import useVideoContext from "context/useVideoContext";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const RandomWaiting = ({
  setVideoScreen,
}: {
  setVideoScreen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    videoTrack,
    userAudioMute,
    userVideoMute,
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
  } = useVideoContext();

  const videoRef = useRef<HTMLVideoElement>(null);

  const { user } = useAppState();

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
              <p className="text-gray-500">{"Join Room"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 flex-col">
            <p className="text-gray-800 font-semibold">
              Meet People Anonymously
            </p>
            <button
              className="px-4 py-2 bg-purple-500 w-full text-white rounded hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              onClick={() => {
                if (userAudioMute || userVideoMute) {
                  toast.info("Please unmute your microphone and camera");
                  return;
                }
                setVideoScreen(true);
              }}
            >
              Join
            </button>
          </div>
          <div className="text-gray-500">
            <p>Please make sure your microphone and camera are ready.</p>
            <p>You will be admitted once a match is found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomWaiting;
