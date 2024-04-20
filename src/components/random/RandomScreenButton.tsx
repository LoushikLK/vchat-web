import {
  Call,
  ChatOutlined,
  MicOff,
  MicOutlined,
  SkipNext,
  VideocamOff,
  VideocamOutlined,
} from "@mui/icons-material";

import { Badge, Button } from "@mui/material";
import Chat from "components/chat/Chat";
import { useEffect, useRef, useState } from "react";

const RandomScreenButton = ({
  classId,
  endCall,
  muteAudio,
  muteVideo,
  isVideoMute,
  isAudioMute,
  skipUser,
}: {
  classId?: string;
  endCall: () => void;
  muteAudio: (muteAudio: boolean) => void;
  muteVideo: (muteVideo: boolean) => void;
  isAudioMute: boolean;
  isVideoMute: boolean;
  skipUser?: () => void;
}) => {
  const [drawerActive, setDrawerActive] = useState(false);
  const [allChats, setAllChats] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  let buttonClicked = useRef(true);

  useEffect(() => {
    if (drawerActive) return;
    !buttonClicked?.current && setUnreadMessages((prev) => prev + 1);
  }, [drawerActive, allChats?.length]);

  return (
    <>
      <div
        className={` ${
          drawerActive ? " w-[calc(100%-5vw)] md:w-[500px]" : "w-0 "
        } h-full fixed top-0 right-0 z-[9999]  transition-all overflow-hidden ease-in-out duration-300 `}
      >
        <Chat
          classId={classId?.toString()}
          allChats={allChats}
          setAllChats={setAllChats}
          closeFn={() => setDrawerActive(false)}
        />
      </div>
      <div className="w-fit z-50 fixed bottom-12 left-1/2 -translate-x-1/2 bg-purple-500 ">
        <div className="flex items-center  gap-2 md:gap-4 p-2 md:p-4 bg-theme/50  rounded-md shadow-lg">
          <Badge badgeContent={unreadMessages} color="success">
            <Button
              onClick={() => {
                setDrawerActive((prev) => !prev);
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
            onClick={() => muteAudio(!isAudioMute)}
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
            onClick={() => muteVideo(!isVideoMute)}
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
                Leave Call
              </h3>
              <Call className="text-white  text-lg md:text-3xl  " />
            </span>
          </Button>
          <Button
            className="!bg-blue-500  !px-2 !py-1 md:!px-4 md:!py-2"
            onClick={skipUser}
          >
            <span className="flex items-center gap-4">
              <h3 className="font-medium tracking-wide text-xs whitespace-nowrap text-white md:text-base">
                Skip Call
              </h3>
              <SkipNext className="text-white  text-lg md:text-3xl  " />
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default RandomScreenButton;
