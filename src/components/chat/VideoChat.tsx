import { Avatar, Button, Input } from "@chakra-ui/react";
import useAppState from "context/useAppState";

const VideoChat = () => {
  const { navbarHight } = useAppState();
  return (
    <div
      style={{
        height: `100vh-${navbarHight}`,
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
        <Input placeholder="Type message..." />{" "}
        <Button className="!bg-blue-500">Send</Button>
      </div>
    </div>
  );
};

export default VideoChat;
