import {
  Call,
  ChatOutlined,
  MicOff,
  MicOutlined,
  People,
  PresentToAll,
  VideocamOff,
  VideocamOutlined,
} from "@mui/icons-material";

import { Button } from "@chakra-ui/react";
import { Badge } from "@mui/material";
import useAppState from "context/useAppState";
import { RoomDataType } from "pages/video/Call";
import { useEffect, useRef, useState } from "react";
import { KeyedMutator } from "swr";
import RoomType from "types/room";
import AttendanceDetails from "./Attendance";
import Chat from "./Chat";

type UserAttendanceData = {
  data: RoomType;
};

const CallButtons = ({
  classId,
  shareScreen,
  endCall,
  muteAudio,
  muteVideo,
  isVideoMute,
  isAudioMute,
  isScreenSharing,
  revalidate,
  data,
}: {
  classId?: string;
  shareScreen: () => void;
  endCall: () => void;
  muteAudio: () => void;
  muteVideo: () => void;
  isAudioMute: boolean;
  isVideoMute: boolean;
  isScreenSharing: boolean;
  revalidate?: KeyedMutator<RoomDataType>;
  data?: RoomType;
}) => {
  const [reloadUser, setReloadUser] = useState(false);
  const [drawerActive, setDrawerActive] = useState(false);
  const [attendanceDetails, setAttendanceDetails] = useState(false);
  const [allChats, setAllChats] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [userJoined, setUserJoined] = useState(false);
  let buttonClicked = useRef(true);
  const { socket, user } = useAppState();

  useEffect(() => {
    if (drawerActive) return;
    !buttonClicked?.current && setUnreadMessages((prev) => prev + 1);
  }, [drawerActive, allChats?.length]);
  useEffect(() => {
    if (attendanceDetails) return;
    !buttonClicked?.current && setUserJoined(true);
  }, [attendanceDetails, reloadUser]);

  useEffect(() => {
    socket?.on("message-receive", (data: any) => {
      buttonClicked.current = false;
      setAllChats((prev) => [...prev, data?.data]);
    });
    socket?.on("new-user-joined", async (data: any) => {
      buttonClicked.current = false;
      setAllChats((prev) => [
        ...prev,
        {
          message: "New user joined the class",
          type: "MIDDLE",
          user: data?.data?.user,
          _id: Date.now() * Math.random(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setReloadUser((prev) => !prev);
      !attendanceDetails && setUserJoined(true);
    });
    socket?.on("user-leaving", async (data: any) => {
      setAllChats((prev) => [
        ...prev,
        {
          message: "User leaving the class",
          type: "MIDDLE",
          user: data?.data?.user,
          _id: Date.now() * Math.random(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setReloadUser((prev) => !prev);
    });
  }, []);

  useEffect(() => {
    revalidate?.();
  }, [reloadUser]);

  return (
    <>
      <div
        className={` ${
          drawerActive ? " w-[calc(100%-5vw)] md:w-[500px]" : "w-0 "
        } h-full fixed top-0 right-0 z-[999]  transition-all overflow-hidden ease-in-out duration-300 `}
      >
        <Chat
          classId={classId?.toString()}
          allChats={allChats}
          setAllChats={setAllChats}
          closeFn={() => setDrawerActive(false)}
        />
      </div>
      <div
        className={` ${
          attendanceDetails ? "w-[calc(100%-5vw)] md:w-[500px]" : "w-0 "
        } h-full   transition-all fixed top-0 right-0 z-[999] overflow-hidden ease-in-out duration-300 `}
      >
        <AttendanceDetails
          allUsers={data?.joinedUsers}
          closeFn={() => setAttendanceDetails(false)}
        />
      </div>
      <div className="w-fit z-50 fixed bottom-12 left-1/2 -translate-x-1/2 bg-blue-500 ">
        <div className="flex items-center  gap-2 md:gap-4 p-2 md:p-4 bg-theme/50  rounded-md shadow-lg">
          <Badge color="secondary" variant="dot" invisible={!userJoined}>
            <Button
              onClick={() => {
                setAttendanceDetails((prev) => !prev);
                setDrawerActive(false);
                setUserJoined(false);
                buttonClicked.current = true;
              }}
              className="!px-2 !py-1 md:!px-4 md:!py-2 "
            >
              <span>
                {attendanceDetails ? (
                  <People className="text-white shadow-lg   " />
                ) : (
                  <People className="text-gray-900   " />
                )}
              </span>
            </Button>
          </Badge>
          <Badge badgeContent={unreadMessages} color="success">
            <Button
              onClick={() => {
                setDrawerActive((prev) => !prev);
                setAttendanceDetails(false);
                setUnreadMessages(0);
                buttonClicked.current = true;
              }}
              className="!px-2 !py-1 md:!px-4 md:!py-2 "
            >
              <span>
                {drawerActive ? (
                  <ChatOutlined className="text-white shadow-lg   " />
                ) : (
                  <ChatOutlined className="text-gray-900   " />
                )}
              </span>
            </Button>
          </Badge>
          <Button
            onClick={shareScreen}
            className="!px-2 !py-1 md:!px-4 md:!py-2 "
          >
            <span>
              {isScreenSharing ? (
                <PresentToAll className="text-white shadow-lg   " />
              ) : (
                <PresentToAll className="text-gray-900   " />
              )}
            </span>
          </Button>

          <Button
            onClick={muteAudio}
            className="!px-2 !py-1 md:!px-4 md:!py-2 "
          >
            <span>
              {isAudioMute ? (
                <MicOff className="text-white shadow-lg   " />
              ) : (
                <MicOutlined className="text-black   " />
              )}
            </span>
          </Button>

          <Button
            onClick={muteVideo}
            className="!px-2 !py-1 md:!px-4 md:!py-2 "
          >
            <span>
              {isVideoMute ? (
                <VideocamOff className="text-white shadow-lg   " />
              ) : (
                <VideocamOutlined className="text-black  " />
              )}
            </span>
          </Button>

          <Button
            className="!bg-red-500  !px-2 !py-1 md:!px-4 md:!py-2"
            onClick={endCall}
          >
            <span className="flex items-center gap-4">
              <h3 className="font-medium tracking-wide text-xs whitespace-nowrap text-white md:text-base">
                {user?.role === "TEACHER" ? "End Call" : "Leave Call"}
              </h3>
              <Call className="text-white  text-lg md:text-3xl  " />
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CallButtons;
