import { Button, Input } from "@chakra-ui/react";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import MessageBox from "./MessageBox";

const VideoChat = ({ roomId }: { roomId?: string }) => {
  const { navbarHight, socket, user } = useAppState();
  const [refetch, setRefetch] = useState(false);

  const [pageNo] = useState(1);

  const [typeMessage, setTypeMessage] = useState("");

  const focusRef = useRef<any>(null);
  let typeBarRef = useRef<any>(null);

  const [messages, setMessages] = useState<any[]>([]);

  const { mutate } = useFetch();

  useEffect(() => {
    focusRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    (async () => {
      try {
        const res = await mutate({
          path: `messages/${roomId}?pageNo=${pageNo}&perPage=20`,
          method: "GET",
        });

        if (res?.status !== 200) {
          setMessages([]);
          return;
        }

        setMessages(res?.data?.data?.data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    })();
  }, [roomId, refetch, pageNo]);

  useEffect(() => {
    // if (!socket) return;

    socket.on("message-received", (data: any) => {
      setRefetch((prev) => !prev);
    });
  }, [socket]);

  const handleSend = async (refId?: string) => {
    try {
      let trimMessage = typeMessage?.trim();

      if (!trimMessage?.length) return;

      let formData = new FormData();

      formData?.append("message", trimMessage);
      if (refId) {
        formData?.append("ref", refId);
      }

      let message = {
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        message: trimMessage,
        replyMessage: false,
        reacted: [],
        roomId,
        seen: [],
        sendBy: {
          displayName: user?.displayName,
          photoUrl: user?.photoUrl,
          _id: user?._id,
        },
        ref: refId,
      };

      socket.emit("message-send", {
        roomId,
        message: {
          message: trimMessage,
          user: {
            _id: user?._id,
            photoUrl: user?.photoUrl,
            displayName: user?.displayName,
          },
        },
      });

      const res = await mutate({
        path: `send-message/${roomId}`,
        method: "POST",
        body: formData,
        isFormData: true,
      });

      setMessages((prev) => {
        return [message, ...prev];
      });

      if (res?.status !== 200) throw new Error(res?.data?.error);
      setTypeMessage("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div
      style={{
        height: `${window.innerHeight - navbarHight}px`,
      }}
      className="w-full relative h-full bg-gray-900 "
    >
      <h3 className="font-medium tracking-wide text-lg flex items-center justify-start pl-4 bg-blue-900 h-[50px] ">
        Live Chat
      </h3>
      <div
        style={{
          height: `${
            window.innerHeight -
            navbarHight -
            typeBarRef?.current?.clientHeight -
            50
          }px`,
        }}
        className="w-full flex flex-col-reverse  overflow-hidden overflow-y-auto "
      >
        {messages?.map((message, index) => (
          <div key={message?._id} ref={index === 0 ? focusRef : null}>
            {message?.sendBy?._id === user?._id ? (
              <MessageBox message={message} type="OWN" key={message?._id} />
            ) : (
              <MessageBox message={message} type="REPLY" key={message?._id} />
            )}
          </div>
        ))}
      </div>
      <div
        className="absolute right-0 bottom-0 flex items-center gap-4 p-4 w-full bg-blue-900 "
        ref={typeBarRef}
      >
        <Input
          placeholder="Type message..."
          onChange={(e) => setTypeMessage(e?.target?.value)}
          value={typeMessage}
        />{" "}
        <Button className="!bg-blue-500" onClick={() => handleSend()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default VideoChat;
