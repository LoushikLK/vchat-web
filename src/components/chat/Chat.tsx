import { Close } from "@mui/icons-material";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
import useAppState from "context/useAppState";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Chat = ({
  classId,
  allChats,
  setAllChats,
  closeFn,
}: {
  classId?: string;
  allChats?: any[];
  setAllChats?: (arg: any) => void;
  closeFn?: () => void;
}) => {
  const [userMessage, setUserMessage] = useState("");

  const { socket, user } = useAppState();

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    try {
      if (!userMessage?.trim()) return;

      socket.emit("message-to-chat", {
        roomId: classId,
        message: {
          message: userMessage,
          user: {
            displayName: user?.displayName,
            photoUrl: user?.photoUrl,
            _id: user?._id,
          },
          createdAt: new Date().toISOString(),
          _id: Date.now() * Math.random(),
        },
      });

      setAllChats?.((prev: any) => [
        ...prev,
        {
          message: userMessage,
          user: {
            displayName: user?.displayName,
            photoUrl: user?.photoUrl,
            _id: user?._id,
          },
          createdAt: new Date().toISOString(),
          _id: Date.now() * Math.random(),
        },
      ]);

      setUserMessage("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if ((allChats?.length || 0) > 0) {
        scrollRef.current &&
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    };
    scrollToBottom();
  }, [allChats]);

  return (
    <div className="w-full relative min-h-screen border-l-gray-700 shadow-lg !bg-gray-800 border-l">
      <div className="flex justify-between w-full bg-theme  items-center">
        <h3 className="font-medium tracking-wide text-lg p-4 ">Live Chat</h3>
        <IconButton onClick={closeFn}>
          <Close />
        </IconButton>
      </div>
      <div className="w-full flex flex-col h-[90vh] overflow-hidden overflow-y-auto  pb-20 ">
        {allChats?.map((item, index) => {
          if (item?.user?._id !== user?._id) {
            return (
              <div
                className="w-full flex items-start gap-2 p-4 "
                key={item?._id + `-` + index}
                ref={scrollRef}
              >
                <Avatar src={item?.user?.photoUrl}>
                  {item?.user?.displayName[0]}
                </Avatar>
                <span className="flex flex-col gap-1  max-w-[70%] justify-end ">
                  <small className="tracking-wide text-white p-2">
                    {item?.user?.displayName}
                  </small>
                  <small className="tracking-wide bg-theme rounded-r-full rounded-bl-full p-2">
                    {item?.message}
                  </small>

                  <small className=" ml-4 text-xs text-theme text-right ">
                    {new Date(item?.createdAt).toDateString()}
                  </small>
                </span>
              </div>
            );
          } else {
            return (
              <div
                className="w-full flex items-start justify-end  gap-2 p-4 "
                key={item?._id + `-` + index}
                ref={scrollRef}
              >
                <span className="flex flex-col gap-1 max-w-[70%]  ">
                  <small className="tracking-wide bg-gray-200 text-gray-900 rounded-l-full rounded-br-full p-2">
                    {item?.message}
                  </small>

                  <small className=" ml-4 text-xs  text-theme ">
                    {new Date(item?.createdAt).toDateString()}
                  </small>
                </span>
              </div>
            );
          }
        })}
      </div>
      <div className="absolute right-0 bottom-0 flex items-center gap-4 p-4 w-full bg-theme ">
        <TextField
          type="text"
          variant="standard"
          value={userMessage}
          className="!text-white"
          fullWidth
          placeholder="Type message..."
          onKeyDown={(e: any) => {
            if (e?.key === "Enter") {
              setUserMessage(e?.target?.value);
              handleSendMessage();
            }
          }}
          onChange={(e) => setUserMessage(e.target.value)}
        />{" "}
        <Button
          className="!bg-purple-500 !px-8 !py-2 !rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
