import { VideocamOff } from "@mui/icons-material";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from "config";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { RoomDataType } from "pages/video/Call";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyedMutator } from "swr";
import RoomType from "types/room";
import CallButtons from "./CallButtons";
import ViewUsers from "./ViewUsers";

const VideoChat = ({
  classId,
  data,
  revalidate,
}: {
  classId?: string;
  revalidate?: KeyedMutator<RoomDataType>;
  data?: RoomType;
}) => {
  const { mutate } = useFetch();
  const navigation = useNavigate();
  const { socket, user } = useAppState();
  const [query] = useSearchParams();

  const client = useRef<IAgoraRTCClient>();

  const videoTrack = useRef<any>();
  const audioTrack = useRef<IMicrophoneAudioTrack>();
  const shareScreenTrack = useRef<any>();
  const screenShareCheck = useRef(false);

  let checkPublish = useRef(false);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [userAudioMute, setUserAudioMute] = useState(false);
  const [userVideoMute, setUserVideoMute] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  let isQueryAudioMuted = query.get("joinWithoutAudio");

  let isQueryVideoMuted = query.get("joinWithoutVideo");

  useEffect(() => {
    if (query.get("joinWithoutVideo") === "true") {
      setUserVideoMute(true);
    }

    if (query.get("joinWithoutAudio") === "true") {
      setUserAudioMute(true);
    }
  }, [isQueryAudioMuted, isQueryVideoMuted, query]);

  const isMounted = useRef(false);
  let count = useRef(0);

  //checking if user is allowed

  useEffect(() => {
    isMounted.current = true;

    if (!isMounted.current) return;
    (async () => {
      try {
        const response = await mutate({
          path: `room/${classId}`,
          method: "GET",
        });

        if (response?.status !== 200)
          throw new Error("You are not allowed to join this room!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
        navigation(`/`);
      }
    })();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  //agrora token  create function
  const tokenCreateFn = async (uid: number, classID: string) => {
    try {
      const response = await mutate({
        path: `room/${classID}/token`,
        method: "POST",
        body: JSON.stringify({
          channelName: classID,
          uid: uid,
          role: "publisher",
          expireTime: 3600,
        }),
      });
      if (response?.data?.error) throw new Error(response?.data?.error);
      return response?.data?.data?.data?.token;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      navigation(`/`);
    }
  };

  //agora client handling
  useEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        if (!user?.vId || !classId || !isMounted.current || !user?.role) return;

        if (count.current !== 0) return;
        count.current++;

        const token = await tokenCreateFn(Number(user?.vId), classId);

        client.current = AgoraRTC.createClient({
          mode: "live",
          codec: "h264",
        });

        client.current.on("user-joined", (user: any) => {
          console.log("===============================join", user);

          setRemoteUsers((prevUsers) => [...prevUsers, user]);
        });

        client.current.on(
          "user-published",
          async (
            user: IAgoraRTCRemoteUser,
            mediaType: "audio" | "video" | "datachannel"
          ) => {
            //subscribe to remote video
            await client.current?.subscribe(user, mediaType);

            console.log({ user, mediaType });

            if (mediaType === "video") {
              // const remoteVideoTrack = user.videoTrack;
              // setUserVideoMute(false);
              // document?.querySelector(`.localVideo`)?.remove();
              // const localPlayerContainer = document.createElement("div");
              // localPlayerContainer.id = "localVideo";
              // localPlayerContainer.className = `localVideo w-full h-screen `;
              // document
              //   ?.querySelector(".local-parent-div")
              //   ?.appendChild(localPlayerContainer);
              // remoteVideoTrack && remoteVideoTrack.play("localVideo");
            }

            if (mediaType === "audio") {
              setUserAudioMute(false);
              // const remoteAudioTrack = user.audioTrack;
              // remoteAudioTrack?.play();
            }

            await client.current?.setClientRole("host");
          }
        );
        client.current.on(
          "user-unpublished",
          async (user: any, mediaType: any) => {
            if (mediaType === "audio") {
              setUserAudioMute(true);
            }

            if (mediaType === "video") {
              setUserVideoMute(true);
            }
          }
        );

        await client.current.join(
          AGORA_APP_ID,
          classId,
          token,
          Number(user?.vId)
        );

        // media stream create
        const [microphoneTrack, cameraTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        videoTrack.current = cameraTrack;
        audioTrack.current = microphoneTrack;

        checkPublish.current = true;

        if (microphoneTrack || cameraTrack) {
          await client.current?.setClientRole("host");
          await client.current.publish([microphoneTrack, cameraTrack]);
        }

        // if (muteAudio) {
        //   muteAudio();
        // }
        // if (muteVideo) {
        //   muteVideo();
        // }

        // document?.querySelector(`.localVideo`)?.remove();
        // const localPlayerContainer = document.createElement("div");
        // localPlayerContainer.id = "localVideo";
        // localPlayerContainer.className = `localVideo w-full h-screen `;
        // document
        //   ?.querySelector(".local-parent-div")
        //   ?.appendChild(localPlayerContainer);
        // cameraTrack && cameraTrack.play("localVideo");
        // client.current.enableAudioVolumeIndicator();
      } catch (error) {
        console.log({ error });

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong.Try reloading the page.");
        }
      }
    })();

    return () => {
      isMounted.current = false;
      if (checkPublish.current) {
        if (videoTrack.current?.enabled) {
          videoTrack.current?.setEnabled(false);
        }
        if (audioTrack.current?.enabled) {
          audioTrack.current?.setEnabled(false);
        }

        client.current?.leave();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.vId, classId, user?.role]);

  //handle share screen

  const shareScreen = async () => {
    if (isScreenSharing) {
      isMounted.current && setIsScreenSharing(false);
      screenShareCheck.current = false;
      videoTrack.current = await AgoraRTC.createCameraVideoTrack();
      shareScreenTrack.current.setEnabled(false);
      await client.current?.unpublish(shareScreenTrack.current);
      await client.current?.publish(videoTrack.current);
      document?.querySelector(`.localVideo`)?.remove();
      const localPlayerContainer = document.createElement("div");
      localPlayerContainer.id = "localVideo";
      localPlayerContainer.className = "localVideo w-full h-screen";
      document
        ?.querySelector(".local-parent-div")
        ?.appendChild(localPlayerContainer);
      videoTrack.current.play("localVideo");
      return;
    }
    try {
      shareScreenTrack.current = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: "1080p_1",
        optimizationMode: "detail",
      });
      isMounted.current && setIsScreenSharing(true);
      screenShareCheck.current = true;
      videoTrack.current?.setEnabled(false);
      await client.current?.unpublish(videoTrack.current);
      await client.current?.publish(shareScreenTrack.current);
      document?.querySelector(`.localVideo`)?.remove();
      const localPlayerContainer = document.createElement("div");
      localPlayerContainer.id = "localVideo";
      localPlayerContainer.className = "localVideo w-full h-screen";
      document
        ?.querySelector(".local-parent-div")
        ?.appendChild(localPlayerContainer);
      shareScreenTrack.current.play("localVideo");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );

      navigation(`/`);
    }
  };

  useEffect(() => {
    (() => {
      isMounted.current = true;

      // When screen share stops this event will be triggered
      shareScreenTrack.current?.on("track-ended", async () => {
        try {
          if (!screenShareCheck.current) return;
          isMounted.current && setIsScreenSharing(false);
          screenShareCheck.current = false;
          videoTrack.current = await AgoraRTC.createCameraVideoTrack();
          shareScreenTrack.current.setEnabled(false);
          await client.current?.unpublish(shareScreenTrack.current);
          await client.current?.publish(videoTrack.current);
          document?.querySelector(`.localVideo`)?.remove();
          const localPlayerContainer = document.createElement("div");
          localPlayerContainer.id = "localVideo";
          localPlayerContainer.className = "localVideo w-full h-screen";
          document
            ?.querySelector(".local-parent-div")
            ?.appendChild(localPlayerContainer);
          videoTrack.current.play("localVideo");
        } catch (error) {}
      });
    })();

    return () => {
      isMounted.current = false;
    };
  }, []);

  //handle user leave
  const handleUserLeave = async () => {
    try {
      await mutate({
        path: `room/leave/${classId}`,
        method: "PUT",
      });

      socket?.emit("user-leaving-class", {
        userId: user?._id,
        roomId: classId,
        user: {
          displayName: user?.displayName,
          photoUrl: user?.photoUrl,
          _id: user?._id,
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );

      navigation(`/`);
    }
  };

  const endCall = async () => {
    client.current?.leave();
    handleUserLeave();
    navigation(`/`);
  };

  function handleUnloadEvent(e: BeforeUnloadEvent) {
    try {
      e.preventDefault();
      endCall();
      return `You are leaving this room. Are you sure?`;
    } catch (error) {}
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnloadEvent);
    return () => {
      window.removeEventListener("beforeunload", handleUnloadEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //handle end call

  //handle mute video
  const muteVideo = () => {
    setUserVideoMute((prev) => !prev);
    videoTrack.current?.setEnabled(!videoTrack.current?.enabled);
  };

  //handle mute audio
  const muteAudio = () => {
    setUserAudioMute((prev) => !prev);
    audioTrack.current?.setEnabled(!audioTrack.current?.enabled);
  };

  return (
    <>
      {/* {userVideoMute && (
        <div className="h-screen w-screen fixed top-0 left-0 bg-gray-800 z-10 ">
          <div className="bg-theme z-[9999] flex-col gap-4 rounded-full flex items-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 justify-center">
            <VideocamOff className="text-white !text-7xl " />
            <h3 className="font-medium tracking-wide text-xs">
              Video Turned Off
            </h3>
          </div>
        </div>
      )}
      {userAudioMute && (
        <div className="bg-gray-100/10 z-[9999] flex-col gap-4 rounded-xl flex items-center fixed left-10 bottom-10 p-4 justify-center">
          <MicOff className="text-white !text-5xl " />
          <h3 className="font-medium tracking-wide text-xs">
            Audio Turned Off
          </h3>
        </div>
      )} */}

      {remoteUsers?.length === 0 ? (
        <div className="h-screen w-screen fixed top-0 left-0 bg-gray-800 z-10 ">
          <div className="bg-theme z-[9999] flex-col gap-4 rounded-full flex items-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 justify-center">
            <VideocamOff className="text-white !text-7xl " />
            <h3 className="font-medium tracking-wide text-xs">
              No one is in the class
            </h3>
          </div>
        </div>
      ) : (
        <ViewUsers remoteUsers={remoteUsers} setRemoteUsers={setRemoteUsers} />
      )}

      <CallButtons
        data={data}
        revalidate={revalidate}
        classId={classId?.toString()}
        shareScreen={shareScreen}
        endCall={endCall}
        muteVideo={muteVideo}
        muteAudio={muteAudio}
        isVideoMute={userVideoMute}
        isAudioMute={userAudioMute}
        isScreenSharing={isScreenSharing}
      />
    </>
  );
};

export default VideoChat;
