import { Button } from "@chakra-ui/react";
import {
  Call,
  ChatOutlined,
  MicOutlined,
  People,
  VideoOutlined,
} from "assets/Icons";
import { VideoChat } from "components/chat";
import { ChatUser } from "components/user";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Peer from "simple-peer";

const CallUI = () => {
  const [peers, setPeers] = useState<any[]>([]);

  const allPeerRef = useRef<any[]>([]);

  const myVideoRef = useRef<any>(null);
  const myStreamRef = useRef<any>(null);

  const [drawerActive, setDrawerActive] = useState(false);
  const [userActiveDrawer, setUserActiveDrawer] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);

  const { roomId } = useParams();

  const { socket, user, navbarHight } = useAppState();

  const navigate = useNavigate();

  const { mutate } = useFetch();

  useEffect(() => {
    (async () => {
      try {
        if (!roomId) return;

        let response = await mutate({
          path: `room/${roomId}`,
          method: "GET",
        });

        if (response?.data?.error) {
          throw new Error(response?.data?.error);
        }

        setRoomData(response?.data?.data?.data);

        const localVideoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        myStreamRef.current = localVideoStream;

        myVideoRef.current.srcObject = localVideoStream;

        socket.emit("new-room-joined", {
          roomId: response?.data?.data?.data?._id,
          userId: user?._id,
        });
        socket.on("user-joined", (data: any) => {
          let newPeer = createPeer(localVideoStream, data?.userId);

          setPeers((prev) => [
            ...prev.filter((item) => item?.userId !== data?.userId),
            {
              userId: data?.userId,
              peer: newPeer,
            },
          ]);

          allPeerRef.current.push({
            peer: newPeer,
            userId: data?.userId,
          });
        });

        socket.on("incoming-signal", (data: any) => {
          //create new peer
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: localVideoStream,
          });

          peer.on("signal", (signal) => {
            socket.emit("exchange-signal", {
              userId: data?.userId,
              signal,
              byUser: user?._id,
            });
          });

          peer.signal(data?.signal);

          setPeers((prev) => [
            ...prev.filter((item) => item?.userId !== data?.userId),
            {
              userId: data?.userId,
              peer: peer,
            },
          ]);

          allPeerRef.current.push({
            peer: peer,
            userId: data?.userId,
          });
        });

        socket.on("reverse-signal", (data: any) => {
          // setPeers((prev) => {
          //   return prev.map((item) => {
          //     if (item?.userId === data?.userId) {
          //       item.peer.signal(data?.signal);
          //       return item;
          //     }
          //     return item;
          //   });
          // });

          allPeerRef.current.forEach((item) => {
            if (item?.userId === data?.userId) {
              item.peer.signal(data.signal);
            }
          });

          // //find user and update
          // let user = allPeerRef.current.find(
          //   (peer) => peer.userId === data.userId
          // );
          // if (user) {
          //   user.peer.signal(data.signal);
          // }
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error?.message);
          navigate("/");
        }
      }

      socket.onAny((name: any, value: any) => {
        console.log(name, value);
        console.log(allPeerRef);
      });
    })();
  }, []);

  const createPeer = (stream: any, userId: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("send-signal-to-user", {
        userId: userId,
        signal,
        byUser: user?._id,
      });
    });

    return peer;
  };

  const handleWindowUnload = (event: any) => {
    console.log("jjj");
  };

  console.log({ peers });

  // useEffect(() => {
  //   window.addEventListener("beforeunload", handleWindowUnload, {
  //     capture: true,
  //   });
  //   return () => {
  //     window.removeEventListener("beforeunload", handleWindowUnload, {
  //       capture: true,
  //     });
  //   };
  // }, []);

  return (
    <section className="w-full  relative text-white  ">
      <ChatUser active={userActiveDrawer} roomId={roomId} />
      <div className="w-full  flex">
        <div
          style={{
            height: `${window.innerHeight - navbarHight}px`,
          }}
          className={` ${
            drawerActive ? "w-[calc(100vw-500px)]" : "w-full"
          }    border-r relative transition-all ease-in-out duration-300 h-full bg-gray-900 border-white  `}
        >
          {!myVideoRef?.current && (
            <div className=" absolute top-1/2 left-1/2 bg-blue-500 h-60 rounded-full -translate-x-1/2 -translate-y-1/2 w-60 text-7xl text-center  flex items-center justify-center  ">
              LK
            </div>
          )}

          <video
            ref={myVideoRef}
            style={{
              height: "10rem",
              width: "18rem",
            }}
            className=" absolute bottom-5 right-5 border-4 rounded-xl  bg-black transition-all ease-in-out object-cover duration-300 "
            autoPlay={true}
          />
          <div className="flex flex-wrap">
            {peers?.map((people) => (
              <Video peer={people?.peer} key={people?.userId} />
            ))}
          </div>
        </div>

        <div
          style={{
            height: `${window.innerHeight - navbarHight}px`,
          }}
          className={` ${
            drawerActive ? "w-[500px]" : "w-0 hidden"
          } h-full   transition-all ease-in-out duration-300 `}
        >
          <VideoChat roomId={roomId} />
        </div>

        <div className="w-fit z-50 fixed bottom-12 left-1/2 -translate-x-1/2 ">
          <div className="flex items-center gap-4  p-4 bg-blue-500/50  rounded-md shadow-lg">
            <Button
              onClick={() => {
                setUserActiveDrawer(!userActiveDrawer);
                setDrawerActive(false);
              }}
            >
              <span>
                <People
                  className={`${
                    userActiveDrawer ? "text-blue-500 " : "text-gray-900"
                  } text-4xl p-2 `}
                />
              </span>
            </Button>
            <Button
              onClick={() => {
                setDrawerActive(!drawerActive);
                setUserActiveDrawer(false);
              }}
            >
              <span>
                <ChatOutlined
                  className={` ${
                    drawerActive ? "text-blue-500 " : "text-gray-900"
                  }  p-2 text-4xl `}
                />
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

const Video = (props: any) => {
  const ref = useRef<any>();
  useEffect(() => {
    if (!ref.current) return;
    props?.peer?.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, [props?.peer]);

  return (
    <video
      ref={ref}
      className={` transition-all ease-in-out object-cover border-2 border-blue-500 duration-300 h-[10rem] w-[10rem] `}
      autoPlay={true}
    />
  );
};
