import AgoraRTC, {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { createContext, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";

const contextDefaultValues: any = {};

type APP_CONTEXT = {
  userAudioMute: boolean;
  userVideoMute: boolean;
  videoTrack?: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
  handleLocalAudioOnOff: (audioState: boolean) => void;
  handleLocalVideoOnOff: (videoState: boolean) => void;
};

const AppContext = createContext<APP_CONTEXT>(contextDefaultValues);
type Props = {
  children: React.ReactNode;
};

export const VideoContextProvider = ({ children }: Props) => {
  const [userAudioMute, setUserAudioMute] = useState(true);
  const [userVideoMute, setUserVideoMute] = useState(true);

  let videoTrack = useRef<ICameraVideoTrack>();
  let audioTrack = useRef<IMicrophoneAudioTrack>();

  const handleLocalVideoOnOff = async (videoState: boolean) => {
    try {
      if (videoState) {
        videoTrack?.current?.setEnabled(false);
        videoTrack.current?.stop();
        videoTrack.current?.close();
        videoTrack.current = undefined;
        setUserVideoMute(true);
      } else {
        const cameraTrack = await AgoraRTC.createCameraVideoTrack();
        videoTrack.current = cameraTrack;
        setUserVideoMute(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleLocalAudioOnOff = async (audioState: boolean) => {
    try {
      if (audioState) {
        audioTrack?.current?.setEnabled(false);
        audioTrack.current?.stop();
        audioTrack.current?.close();
        audioTrack.current = undefined;
        setUserAudioMute(true);
      } else {
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
        audioTrack.current = microphoneTrack;
        setUserAudioMute(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        userAudioMute,
        userVideoMute,
        videoTrack: videoTrack.current,
        audioTrack: audioTrack.current,
        handleLocalAudioOnOff,
        handleLocalVideoOnOff,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useVideoContext = () => {
  const {
    userAudioMute,
    userVideoMute,
    videoTrack,
    audioTrack,
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
  } = useContext(AppContext);

  return {
    userAudioMute,
    userVideoMute,
    videoTrack,
    audioTrack,
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
  };
};

export default useVideoContext;
