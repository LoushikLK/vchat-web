import { Close, PushPin } from "@mui/icons-material";
import { Avatar, Dialog, IconButton } from "@mui/material";
import {
  ICameraVideoTrack,
  ILocalVideoTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { createRef, useEffect } from "react";

const PinScreen = ({
  open,
  onClose,
  stream,
  userName,
  photoUrl,
  videoVisible,
}: {
  open: boolean;
  onClose: () => void;
  stream?: ICameraVideoTrack | IRemoteVideoTrack | ILocalVideoTrack;
  videoVisible?: boolean;
  userName?: string;
  photoUrl?: string;
}) => {
  const localVideo = createRef<HTMLVideoElement>();

  useEffect(() => {
    if (!localVideo.current) return;
    localVideo.current.srcObject = stream
      ? new MediaStream([stream?.getMediaStreamTrack()])
      : null;
  }, [stream, localVideo, open]);

  console.log({ videoVisible });
  console.log({ stream });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      style={{
        zIndex: 9999,
      }}
    >
      <div className="w-full bg-gray-900 min-h-screen flex flex-col items-center justify-start ">
        <div className="flex items-center justify-between bg-purple-700 w-full p-4">
          <h3 className="w-full text-white font-medium tracking-wide text-lg ">
            {userName} is Pinned <PushPin />
          </h3>
          <IconButton onClick={onClose}>
            <Close className="!text-white" />
          </IconButton>
        </div>
        <div className="w-full flex items-center justify-center min-h-[90vh]">
          {videoVisible ? (
            <video
              className={`w-full h-full  `}
              playsInline
              ref={localVideo}
              autoPlay
            />
          ) : (
            <Avatar
              src={photoUrl}
              className="w-full h-full"
              alt={userName}
              sx={{
                width: 100,
                height: 100,
                fontSize: 50,
                border: "2px solid white",
              }}
            >
              {userName?.[0] || "Anonymous"}
            </Avatar>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default PinScreen;
