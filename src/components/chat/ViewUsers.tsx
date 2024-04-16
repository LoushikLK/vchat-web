import {
  CropFree,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { Avatar, Tooltip } from "@mui/material";
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalVideoTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import useAppState from "context/useAppState";
import useVideoContext, { CustomRemoteUser } from "context/useVideoContext";
import { createRef, useEffect, useRef, useState } from "react";
import PinScreen from "./PinScreen";

const ViewUsers = ({ agoraClient }: { agoraClient?: IAgoraRTCClient }) => {
  const { user } = useAppState();
  let {
    userVideoMute,
    userAudioMute,
    videoTrack,
    remoteUsers,
    shareScreenTrack,
    isUserScreenSharing,
  } = useVideoContext();

  return (
    <div className="w-full bg-black min-h-screen grid grid-cols-12 gap-4 p-4 place-content-center ">
      <div
        className={`${
          remoteUsers?.length === 1 ? "col-span-6" : "col-span-4"
        } bg-black border-2 rounded-md shadow-xl h-full min-h-[25rem] flex items-center  justify-center relative  `}
        key={"100xx222xxx"}
      >
        <ViewStream
          stream={isUserScreenSharing ? shareScreenTrack : videoTrack}
          userName={user?.displayName}
          photoUrl={user?.photoUrl}
          videoVisible={!userVideoMute || isUserScreenSharing}
        />

        <h3 className="font-medium tracking-wide text-sm absolute top-0 left-0 p-2 border-md z-[9997] bg-purple-800/20 ">
          {user?.displayName}
        </h3>

        <div className="absolute top-0 right-0 flex items-center justify-center flex-col p-4 gap-4">
          <div className="bg-gray-100/10 z-[9997] flex-col gap-4 rounded-xl flex items-center p-4 justify-center">
            {userVideoMute ? (
              <VideocamOff className="text-white !text-2xl " />
            ) : (
              <Videocam className="text-white !text-2xl " />
            )}
          </div>
          <div className="bg-gray-100/10 z-[9997] flex-col gap-4 rounded-xl flex items-center  p-4 justify-center">
            {userAudioMute ? (
              <MicOff className="text-white !text-2xl " />
            ) : (
              <Mic className="text-white !text-2xl " />
            )}
          </div>
        </div>
      </div>
      {remoteUsers?.map((user: CustomRemoteUser) => {
        return (
          <RemoteUserView
            key={user?.uid}
            remoteUserCount={remoteUsers?.length}
            user={user}
            agoraClient={agoraClient}
          />
        );
      })}
    </div>
  );
};

export default ViewUsers;

const ViewStream = ({
  stream,
  videoVisible,
  userName,
  photoUrl,
  className,
}: {
  stream?: ICameraVideoTrack | IRemoteVideoTrack | ILocalVideoTrack;
  videoVisible?: boolean;
  userName?: string;
  photoUrl?: string;
  className?: string;
}) => {
  const localVideo = createRef<HTMLVideoElement>();

  useEffect(() => {
    if (localVideo.current)
      localVideo.current.srcObject = stream
        ? new MediaStream([stream?.getMediaStreamTrack()])
        : null;
  }, [stream, localVideo]);

  return (
    <>
      {videoVisible ? (
        <video
          className={`w-full h-full  ${className} `}
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
    </>
  );
};

const RemoteUserView = ({
  user,
  remoteUserCount,
  agoraClient,
}: {
  user: CustomRemoteUser;
  remoteUserCount: number;
  agoraClient?: IAgoraRTCClient;
}) => {
  const [userVideoActive, setUserVideoActive] = useState<boolean>(false);
  const [userAudioActive, setUserAudioActive] = useState<boolean>(false);
  const [pinScreen, setPinScreen] = useState<boolean>(false);
  const videoTrack = useRef<IRemoteVideoTrack | undefined>();
  useEffect(() => {
    agoraClient?.on(
      "user-published",
      async (publishUser: IAgoraRTCRemoteUser, mediaType: string) => {
        console.log(
          "user published===============================================",
          user,
          mediaType
        );

        if (mediaType === "video") {
          if (Number(user?.uid) !== Number(publishUser?.uid)) return;

          await agoraClient?.subscribe(publishUser, mediaType);

          videoTrack.current = publishUser.videoTrack;
          setUserVideoActive(true);
        }
        if (mediaType === "audio") {
          await agoraClient?.subscribe(publishUser, mediaType);
          publishUser.audioTrack?.play();
          setUserAudioActive(true);
        }
      }
    );
    agoraClient?.on(
      "user-unpublished",
      async (user: IAgoraRTCRemoteUser, mediaType: string) => {
        if (mediaType === "video") {
          await agoraClient?.unsubscribe(user, mediaType);
          setUserVideoActive(false);
        }
        if (mediaType === "audio") {
          await agoraClient?.unsubscribe(user, mediaType);
          setUserAudioActive(false);
        }
      }
    );
  });

  return (
    <>
      <PinScreen
        open={pinScreen}
        onClose={() => setPinScreen(false)}
        stream={videoTrack?.current}
        photoUrl={user?.details?.photoUrl}
        userName={user?.details?.displayName}
        videoVisible={userVideoActive}
      />

      <div
        className={`${
          remoteUserCount === 1 ? "col-span-6" : "col-span-4"
        } bg-black border-2 rounded-md shadow-xl min-h-[25rem] h-full flex items-center  justify-center relative `}
        key={user.uid}
      >
        <ViewStream
          stream={videoTrack?.current}
          userName={user?.details?.displayName}
          photoUrl={user?.details?.photoUrl}
          videoVisible={userVideoActive}
        />

        <h3 className="font-medium tracking-wide text-sm absolute top-0 left-0 p-2 border-md z-[9997] bg-purple-800/20 ">
          {user?.details?.displayName}
        </h3>

        <div className="absolute top-0 right-0 flex items-center justify-center flex-col p-4 gap-4">
          <div
            className="bg-gray-100/10 z-[9997] flex-col gap-4 rounded-xl cursor-pointer flex items-center p-4 justify-center"
            onClick={() => setPinScreen(true)}
          >
            {
              <Tooltip title="Pin Screen">
                <CropFree className="text-white !text-2xl " />
              </Tooltip>
            }
          </div>
          <div className="bg-gray-100/10 z-[9997] flex-col gap-4 rounded-xl cursor-pointer flex items-center p-4 justify-center">
            <Tooltip title="Camera">
              {!userVideoActive ? (
                <VideocamOff className="text-white !text-2xl " />
              ) : (
                <Videocam className="text-white !text-2xl " />
              )}
            </Tooltip>
          </div>
          <div className="bg-gray-100/10 z-[9997] flex-col gap-4 rounded-xl cursor-pointer flex items-center  p-4 justify-center">
            <Tooltip title="Audio">
              {!userAudioActive ? (
                <MicOff className="text-white !text-2xl " />
              ) : (
                <Mic className="text-white !text-2xl " />
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export { ViewStream };
