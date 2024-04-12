import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import useAppState from "context/useAppState";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoomType from "types/room";

const Waiting = ({
  data,
  setVideoScreen,
}: {
  data?: RoomType;
  setVideoScreen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate();

  const { user } = useAppState();

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-full gap-4 items-center justify-center  max-w-5xl ">
        <div className="w-full flex-col flex items-center justify-center bg-gray-400/50 shadow-2xl px-8 pt-8 rounded-md ">
          <div className="w-full h-72 bg-gray-900 flex items-center justify-center overflow-hidden ">
            {videoStream?.active ? (
              <video key={"12457856"} autoPlay={true} ref={videoRef}></video>
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
              <p className="text-gray-500">{data?.title}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 flex-col">
            <p className="text-gray-800 font-semibold">
              Waiting for the meeting to start...
            </p>
            <button
              className="px-4 py-2 bg-blue-500 w-full text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={() => {
                navigate(
                  `/call/${data?._id}?video=${Boolean(
                    videoStream?.active
                  )}&audio=${Boolean(audioStream?.active)}`
                );

                setVideoScreen(true);
              }}
            >
              Join
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
