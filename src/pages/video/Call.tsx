import { Button } from "@chakra-ui/react";
import {
  Call,
  ChatOutlined,
  MicOutlined,
  People,
  VideoOutlined,
} from "assets/Icons";
import { VideoChat } from "components/chat";
import { useEffect, useState } from "react";

const CallUI = () => {
  const [drawerActive, setDrawerActive] = useState(true);

  const [videoStream, setVideoStream] = useState<any>(undefined);

  // useEffect(() => {
  //   let timeOut = setInterval(() => {
  //     setDrawerActive(!drawerActive);
  //   }, 1000);

  //   return () => {
  //     clearInterval(timeOut);
  //   };
  // }, [drawerActive]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log(stream);
        setVideoStream(stream);
      })();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full  relative text-white  ">
      <div className="w-full flex">
        <div
          className={` ${
            drawerActive ? "w-[calc(100vw-500px)]" : "w-full"
          } h-full min-h-screen  border-r relative transition-all ease-in-out duration-300  bg-gray-900 border-white `}
        >
          {/* <div className=" absolute top-1/2 left-1/2 bg-blue-500 h-60 rounded-full -translate-x-1/2 -translate-y-1/2 w-60 text-7xl text-center  flex items-center justify-center  ">
            LK
          </div> */}
          <video
            src={videoStream}
            className="min-h-screen w-full"
            autoPlay={true}
          />
        </div>

        <div
          className={` ${
            drawerActive ? "w-[500px]" : "w-0"
          } h-full min-h-screen  transition-all ease-in-out duration-300 `}
        >
          {" "}
          <VideoChat />
        </div>
        <div className="w-fit z-50 fixed bottom-12 left-1/2 -translate-x-1/2 ">
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
                <h3 className="font-medium tracking-wide text-base">
                  END CALL
                </h3>
                <Call className="text-white text-3xl " />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallUI;
