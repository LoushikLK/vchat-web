import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import useAppState from "context/useAppState";
import useVideoContext from "context/useVideoContext";
import {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CustomRemoteUser } from "./VideoChat";

const ViewUsers = ({
  remoteUsers,
  setRemoteUsers,
  localVideo,
  agoraClient,
}: {
  remoteUsers: CustomRemoteUser[];
  setRemoteUsers: Dispatch<SetStateAction<CustomRemoteUser[]>>;
  localVideo?: ICameraVideoTrack;
  agoraClient?: IAgoraRTCClient;
}) => {
  console.log({ remoteUsers });

  const { user } = useAppState();
  const { userVideoMute, userAudioMute } = useVideoContext();

  return (
    <div className="w-full bg-black min-h-screen grid grid-cols-12 gap-4 p-4 place-content-center ">
      <div
        className={`${
          remoteUsers?.length === 1 ? "col-span-6" : "col-span-4"
        } bg-red-500 border-2 rounded-md shadow-xl h-full min-h-[25rem] flex items-center  justify-center relative  `}
        key={"100xx222xxx"}
      >
        <ViewStream
          stream={localVideo}
          userName={user?.displayName}
          photoUrl={user?.photoUrl}
          videoVisible={!userVideoMute}
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
  stream?: ICameraVideoTrack | IRemoteVideoTrack;
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
  const [userVideoMute, setUserVideoMute] = useState(true);

  const [userAudioMute, setUserAudioMute] = useState(true);

  const videoTrack = useRef<IRemoteVideoTrack>();

  useEffect(() => {
    if (!user?.uid) return;

    agoraClient?.on(
      "user-published",
      async (publishUser: IAgoraRTCRemoteUser, mediaType: any) => {
        if (Number(user?.uid) !== Number(publishUser?.uid)) return;

        if (mediaType === "video") {
          await agoraClient?.subscribe(publishUser, mediaType);
          videoTrack.current = publishUser.videoTrack;
          setUserVideoMute(false);
        }

        if (mediaType === "audio") {
          publishUser?.audioTrack?.play();
          setUserAudioMute(false);
        }
      }
    );

    agoraClient?.on(
      "user-unpublished",
      async (publishUser: IAgoraRTCRemoteUser, mediaType: any) => {
        if (user?.uid === publishUser?.uid) return;
        if (mediaType === "audio") {
          setUserAudioMute(true);
        }

        if (mediaType === "video") {
          setUserVideoMute(true);
        }
      }
    );
  }, [user?.uid, agoraClient]);

  return (
    <div
      className={`${
        remoteUserCount === 1 ? "col-span-6" : "col-span-4"
      } bg-red-500 border-2 rounded-md shadow-xl min-h-[25rem] h-full flex items-center  justify-center relative `}
      key={user.uid}
    >
      <ViewStream
        stream={videoTrack?.current}
        userName={user?.details?.displayName}
        photoUrl={user?.details?.photoUrl}
        videoVisible={!userVideoMute}
      />

      <h3 className="font-medium tracking-wide text-sm absolute top-0 left-0 p-2 border-md z-[9997] bg-purple-800/20 ">
        {user?.details?.displayName}
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
  );
};

export { ViewStream };
