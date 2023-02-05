import { Avatar, Button, Input } from "@chakra-ui/react";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const VideoChat = ({ roomId }: { roomId?: string }) => {
  const { navbarHight, socket } = useAppState();

  const [typeMessage, setTypeMessage] = useState("");

  const { mutate } = useFetch();

  useEffect(() => {}, [socket]);

  const handleSend = async (refId?: string) => {
    try {
      let trimMessage = typeMessage?.trim();

      if (!trimMessage?.length) return;

      let formData = new FormData();

      formData?.append("message", trimMessage);
      if (refId) {
        formData?.append("ref", trimMessage);
      }

      const res = await mutate({
        path: `send-message/${roomId}`,
        method: "POST",
        body: formData,
        isFormData: true,
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
      className="w-full relative h-full bg-gray-900"
    >
      <h3 className="font-medium tracking-wide text-lg p-4 bg-blue-900 ">
        Live Chat
      </h3>
      <div className="w-full flex flex-col-reverse  ">
        <div className="w-full flex items-start gap-2 p-4 ">
          <Avatar size={"sm"} />
          <span className="flex flex-col gap-1  max-w-[70%] justify-end ">
            <small className="tracking-wide bg-blue-500 rounded-r-full rounded-bl-full p-2">
              wjbiwedbweid ewidbiuduedeud iewdwd d
            </small>

            <small className=" ml-4 text-xs text-blue-700 text-right ">
              20:30 PM
            </small>
          </span>
        </div>
        <div className="w-full flex items-start justify-end  gap-2 p-4 ">
          <span className="flex flex-col gap-1 max-w-[70%]  ">
            <small className="tracking-wide bg-gray-200 text-gray-900 rounded-l-full rounded-br-full p-2">
              wjbiwedbweid ewidbiuduedeud iewdwd d
            </small>

            <small className=" ml-4 text-xs  text-blue-700 ">20:30 PM</small>
          </span>
          <Avatar size={"sm"} />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 flex items-center gap-4 p-4 w-full bg-blue-900 ">
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
