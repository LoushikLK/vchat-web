import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import useVideoContext from "context/useVideoContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Random = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
    userVideoMute,
    userAudioMute,
    videoTrack,
  } = useVideoContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoTrack?.enabled) {
      videoRef.current &&
        (videoRef.current.srcObject = new MediaStream([
          videoTrack?.getMediaStreamTrack(),
        ]));
    }
  }, [videoTrack?.enabled, videoTrack]);

  const handleFindRoom = () => {
    navigate(`/call/random`);
  };

  console.log({ userVideoMute, userAudioMute });

  return (
    <div className="w-full flex-col flex items-center justify-center  ">
      <div className="w-full h-72 bg-gray-900 flex items-center justify-center overflow-hidden ">
        {!userVideoMute ? (
          <video
            key={"12457856"}
            style={{
              maxHeight: "288px",
              maxWidth: "533px",
              objectFit: "cover",
            }}
            autoPlay={true}
            ref={videoRef}
          ></video>
        ) : (
          <VideocamOff className="!text-white" />
        )}
      </div>
      <div className="flex items-center justify-evenly pt-4 w-full">
        <IconButton
          className="h-20 w-20 "
          onClick={async () => handleLocalAudioOnOff(false)}
        >
          {!userAudioMute ? <Mic color="primary" /> : <MicOff color="error" />}
        </IconButton>
        <IconButton
          className="h-20 w-20 "
          onClick={async () => handleLocalVideoOnOff(false)}
        >
          {!userVideoMute ? (
            <Videocam color="primary" />
          ) : (
            <VideocamOff color="error" />
          )}
        </IconButton>
      </div>
      <Button
        variant="contained"
        fullWidth
        className="!bg-gray-600 !mb-4 !text-white"
        onClick={handleFindRoom}
      >
        Find
      </Button>
    </div>
  );
};

export default Random;
