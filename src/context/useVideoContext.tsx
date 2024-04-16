import AgoraRTC, {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { createContext, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import UserType from "types/user";

const contextDefaultValues: any = {};

export interface CustomRemoteUser extends IAgoraRTCRemoteUser {
  details?: UserType;
}

type APP_CONTEXT = {
  userAudioMute: boolean;
  userVideoMute: boolean;
  videoTrack?: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
  handleLocalAudioOnOff: (audioState: boolean) => void;
  handleLocalVideoOnOff: (videoState: boolean) => void;
  remoteUsers: CustomRemoteUser[];
  setRemoteUsers: React.Dispatch<React.SetStateAction<CustomRemoteUser[]>>;
  shareScreenTrack?: ILocalVideoTrack;
  isUserScreenSharing: boolean;
  handleScreenSharingOnOff: (videoState: boolean) => void;
};

const AppContext = createContext<APP_CONTEXT>(contextDefaultValues);
type Props = {
  children: React.ReactNode;
};

export const VideoContextProvider = ({ children }: Props) => {
  const [userAudioMute, setUserAudioMute] = useState(true);
  const [userVideoMute, setUserVideoMute] = useState(true);
  const [isUserScreenSharing, setIsUserScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<CustomRemoteUser[]>([]);

  let videoTrack = useRef<ICameraVideoTrack>();
  let audioTrack = useRef<IMicrophoneAudioTrack>();
  let shareScreenTrack = useRef<ILocalVideoTrack>();

  const handleLocalVideoOnOff = async (videoState: boolean) => {
    try {
      if (videoState) {
        videoTrack?.current && videoTrack?.current?.setEnabled(false);
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
  const handleScreenSharingOnOff = async (videoState: boolean) => {
    try {
      if (videoState) {
        shareScreenTrack?.current &&
          shareScreenTrack?.current?.setEnabled(false);
        setIsUserScreenSharing(false);
      } else {
        shareScreenTrack.current = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "1080p_1",
            optimizationMode: "detail",
          },
          "disable"
        );
        setIsUserScreenSharing(true);
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
        remoteUsers,
        setRemoteUsers,
        shareScreenTrack: shareScreenTrack.current,
        isUserScreenSharing,
        handleScreenSharingOnOff,
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
    remoteUsers,
    setRemoteUsers,
    shareScreenTrack,
    isUserScreenSharing,
    handleScreenSharingOnOff,
  } = useContext(AppContext);

  return {
    userAudioMute,
    userVideoMute,
    videoTrack,
    audioTrack,
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
    remoteUsers,
    setRemoteUsers,
    shareScreenTrack,
    isUserScreenSharing,
    handleScreenSharingOnOff,
  };
};

export default useVideoContext;
