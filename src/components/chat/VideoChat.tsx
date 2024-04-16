import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from "config";
import useAppState from "context/useAppState";
import useVideoContext from "context/useVideoContext";
import { useFetch } from "hooks";
import { RoomDataType } from "pages/video/Call";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyedMutator } from "swr";
import RoomType from "types/room";
import CallButtons from "./CallButtons";
import ViewUsers, { ViewStream } from "./ViewUsers";

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
  let {
    audioTrack,
    videoTrack,
    userAudioMute,
    userVideoMute,
    handleLocalAudioOnOff,
    handleLocalVideoOnOff,
    remoteUsers,
    setRemoteUsers,
    isUserScreenSharing,
    shareScreenTrack,
    handleScreenSharingOnOff,
  } = useVideoContext();

  const client = useRef<IAgoraRTCClient>();
  const screenShareCheck = useRef(false);
  const userJoined = useRef(false);

  let checkPublish = useRef(false);

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
    let isPublished = checkPublish.current;
    (async () => {
      try {
        if (
          !user?.vId ||
          !classId ||
          !isMounted.current ||
          !user?.role ||
          client?.current
        )
          return;

        if (count.current !== 0) return;
        count.current++;

        client.current = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        // client.current?.on("user-joined", async (user: IAgoraRTCRemoteUser) => {
        //   console.log(
        //     "user joined===============================================",
        //     user
        //   );

        //   const userData = await mutate({
        //     path: `user/${user.uid}`,
        //     method: "GET",
        //   });

        //   if (userData?.status === 200) {
        //     setRemoteUsers((prevUsers) => [
        //       ...prevUsers,
        //       {
        //         ...user,
        //         details: userData?.data?.data?.data,
        //       },
        //     ]);
        //   }
        // });
        // client.current?.on("user-left", async (user: IAgoraRTCRemoteUser) => {
        //   setRemoteUsers((prevUsers) =>
        //     prevUsers?.filter((curr) => curr?.uid !== user?.uid)
        //   );
        // });

        const token = await tokenCreateFn(Number(user?.vId), classId);

        await client.current?.join(
          AGORA_APP_ID,
          classId,
          token,
          Number(user?.vId)
        );

        userJoined.current = true;

        if (videoTrack?.enabled) {
          await client.current?.publish(videoTrack);
        }

        if (audioTrack?.enabled) {
          await client.current?.publish(audioTrack);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong.Try reloading the page.");
        }
      }
    })();

    return () => {
      isMounted.current = false;
      if (isPublished) {
        if (videoTrack?.enabled) {
          videoTrack?.setEnabled(false);
        }
        if (audioTrack?.enabled) {
          audioTrack?.setEnabled(false);
        }

        client.current?.leave();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.vId, classId, user?.role, audioTrack, videoTrack]);

  useEffect(() => {
    if (!client.current) return;

    client.current?.on("user-joined", async (user: IAgoraRTCRemoteUser) => {
      console.log(
        "user joined===============================================",
        user
      );

      const userData = await mutate({
        path: `user/${user.uid}`,
        method: "GET",
      });

      if (userData?.status === 200) {
        setRemoteUsers((prevUsers) => [
          ...prevUsers?.filter((curr) => curr?.uid !== user?.uid),
          {
            ...user,
            details: userData?.data?.data?.data,
          },
        ]);
      }
    });
    client.current?.on("user-left", async (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prevUsers) =>
        prevUsers?.filter((curr) => curr?.uid !== user?.uid)
      );
    });
  }, []);

  //handle share screen

  const shareScreen = async () => {
    if (isUserScreenSharing) {
      !userVideoMute && handleLocalVideoOnOff(!userVideoMute);
      isMounted.current && handleScreenSharingOnOff(true);
      screenShareCheck.current = false;
      await client.current?.unpublish(shareScreenTrack);
      return;
    }
    try {
      isMounted.current && handleScreenSharingOnOff(false);
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
      shareScreenTrack?.on("track-ended", async () => {
        try {
          if (!screenShareCheck.current) return;
          isMounted.current && handleLocalVideoOnOff(true);
          screenShareCheck.current = false;
          shareScreenTrack?.setEnabled(false);
          shareScreenTrack &&
            (await client.current?.unpublish(shareScreenTrack));
          !userVideoMute && handleLocalVideoOnOff(!userVideoMute);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong"
          );
        }
      });
    })();

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (!userVideoMute && userJoined.current) {
        videoTrack?.setEnabled(true);
        await client.current?.unpublish(shareScreenTrack);
        await client.current?.unpublish(videoTrack);
        videoTrack && (await client.current?.publish(videoTrack));
      }

      if (!userAudioMute && userJoined.current) {
        audioTrack?.setEnabled(true);
        await client.current?.unpublish(audioTrack);
        audioTrack && (await client.current?.publish(audioTrack));
      }
    })();
  }, [
    userVideoMute,
    userAudioMute,
    videoTrack,
    audioTrack,
    shareScreenTrack,
    isUserScreenSharing,
  ]);

  useEffect(() => {
    (async () => {
      if (isUserScreenSharing && shareScreenTrack?.enabled) {
        videoTrack && videoTrack?.setEnabled(false);
        videoTrack && (await client?.current?.unpublish(videoTrack));
        shareScreenTrack?.setEnabled(true);
        await client.current?.publish(shareScreenTrack);
      }
    })();
  }, [
    isUserScreenSharing,
    shareScreenTrack,
    shareScreenTrack?.enabled,
    videoTrack,
  ]);

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
  const muteVideo = async (muteState: boolean) => {
    handleLocalVideoOnOff(muteState);
  };

  //handle mute audio
  const muteAudio = async (muteState: boolean) => {
    handleLocalAudioOnOff(muteState);
  };

  return (
    <>
      {remoteUsers?.length === 0 ? (
        <>
          {userVideoMute ? (
            <div className="h-screen w-screen fixed top-0 left-0 bg-gray-800 z-10 ">
              <div className="bg-theme z-[9999] flex-col gap-4 rounded-full flex items-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 justify-center">
                <VideocamOff className="text-white !text-7xl " />
                <h3 className="font-medium tracking-wide text-xs">
                  No one is in the room
                </h3>
              </div>
            </div>
          ) : (
            <div
              className={`  border-2 rounded-md shadow-xl h-full min-h-[25rem] flex items-center  justify-center relative  `}
              key={"100xx222xxx"}
            >
              <ViewStream
                stream={isUserScreenSharing ? shareScreenTrack : videoTrack}
                userName={user?.displayName}
                photoUrl={user?.photoUrl}
                videoVisible={!userVideoMute || isUserScreenSharing}
                className="max-h-[90vh] w-full"
              />

              <h3 className="font-medium tracking-wide text-sm absolute top-0 left-0 p-2 border-md z-[9997] bg-purple-800/20 ">
                {user?.displayName}
              </h3>

              <div className="absolute top-0 right-0 flex items-center justify-center flex-col p-4 gap-4">
                <div className="bg-gray-100/10 z-[9997] flex-col gap-4 rounded-xl flex items-center p-4 justify-center">
                  <Videocam className="text-white !text-2xl " />
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
          )}
        </>
      ) : (
        <ViewUsers agoraClient={client?.current} />
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
        isScreenSharing={isUserScreenSharing}
      />
    </>
  );
};

export default VideoChat;
