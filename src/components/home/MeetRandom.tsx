import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MeetRandom = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate();

  const { user, socket } = useAppState();
  const { mutate } = useFetch();

  const navigation = useNavigate();

  const getUserAudio = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("No audio source is found!");
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setAudioStream(audioStream);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };
  const closeUserAudio = () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("No audio source is found!");
      }

      if (audioStream) {
        audioStream?.getTracks()?.forEach((track) => track?.stop());
        setAudioStream(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };
  const getUserVideo = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("No video source is found!");
      }

      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setVideoStream(videoStream);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  useEffect(() => {
    if (videoStream?.active) {
      videoRef.current && (videoRef.current.srcObject = videoStream);
    }
  }, [videoStream?.active, videoStream]);

  const closeUserVideo = () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("No video source is found!");
      }

      if (videoStream) {
        videoStream?.getTracks()?.forEach((track) => track?.stop());
      }

      videoRef.current && (videoRef.current.srcObject = null);
      setVideoStream(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full p-4 shadow-xl rounded-xl bg-white">
      <h3 className="font-medium tracking-wide text-4xl p-4 text-center text-blue-800">
        Go Anonymous
      </h3>

      <div className="w-full flex-col flex items-center justify-center  ">
        <div className="w-full h-72 bg-gray-900 flex items-center justify-center overflow-hidden ">
          {videoStream?.active ? (
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
            onClick={async () => {
              if (audioStream?.active) {
                closeUserAudio();
              } else {
                getUserAudio();
              }
            }}
          >
            {audioStream?.active ? (
              <Mic color="primary" />
            ) : (
              <MicOff color="error" />
            )}
          </IconButton>
          <IconButton
            className="h-20 w-20 "
            onClick={async () => {
              if (videoStream?.active) {
                closeUserVideo();
              } else {
                getUserVideo();
              }
            }}
          >
            {videoStream?.active ? (
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
          onClick={() => {}}
        >
          Find
        </Button>
      </div>
    </div>
  );
};

export default MeetRandom;
