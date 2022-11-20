import { Button } from "@chakra-ui/react";
import {
  Call,
  ChatOutlined,
  MicOutlined,
  People,
  VideoOutlined,
} from "assets/Icons";

const CallUI = () => {
  return (
    <section className="w-full bg-gray-900 min-h-screen relative text-white  ">
      <div className=" fixed top-1/2 left-1/2 bg-blue-500 h-60 rounded-full -translate-x-1/2 -translate-y-1/2 w-60 text-7xl text-center  flex items-center justify-center  ">
        LK
      </div>
      <div className="w-fit fixed bottom-12 left-1/2 -translate-x-1/2 ">
        <div className="flex items-center gap-4  p-4 bg-blue-500/50  rounded-md shadow-lg">
          <Button>
            <span>
              <People className="text-gray-900 text-4xl p-2 " />
            </span>
          </Button>
          <Button>
            <span>
              <ChatOutlined className="text-gray-900 p-2 text-4xl " />
            </span>
          </Button>
          <Button>
            <span>
              <MicOutlined className="text-blue-500 p-2 text-4xl " />
            </span>
          </Button>
          <Button>
            <span>
              <VideoOutlined className="text-blue-500 p-2 text-4xl " />
            </span>
          </Button>
          <Button className="!bg-red-500">
            <span className="flex items-center gap-4">
              <h3 className="font-medium tracking-wide text-base">END CALL</h3>
              <Call className="text-white text-3xl " />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallUI;
