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
import { useFetch, useMounted } from "hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Peer from "simple-peer";

const CallUI = () => {
  const [peers, setPeers] = useState<any[]>([]);

  const allPeople = useRef<any[]>([]);

  const myVideoRef = useRef<any>(null);
  const myStreamRef = useRef<any>(null);
  const myPeerRef = useRef<any>(null);

  const [drawerActive, setDrawerActive] = useState(false);
  const [userActiveDrawer, setUserActiveDrawer] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);

  const { roomId } = useParams();

  const { socket, user, navbarHight } = useAppState();

  const navigate = useNavigate();

  const { mutate } = useFetch();

  const isMounted = useMounted();

  const remoteStream = useRef<any>(null);
  const remoteVideo = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
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
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error?.message);
          navigate("/");
        }
      }
    })();
  }, [roomId, isMounted]);

  useEffect(() => {
    if (!roomData?._id || !myStreamRef.current) return;

    const myPeer = new Peer({
      initiator: true,
      trickle: false,
      stream: myStreamRef.current,
    });

    myPeerRef.current = myPeer;

    myPeer.on("signal", (signal) => {
      socket.emit("join-new-room", {
        roomId: roomData?._id,
        signal,
        userId: user?._id,
      });
    });
  }, [socket, roomData?._id, myStreamRef.current]);

  useEffect(() => {
    socket.on("user-joined", (data: any) => {
      if (!data?.userId) return;
      setPeers((item: any) => {
        return [
          ...item?.filter((item: any) => item?.userId != data?.userId),
          data,
        ];
      });
    });

    socket.on("exchange-peer", (data: any) => {
      console.log({ data });
      let user = allPeople?.current?.find((item: any) => {
        return item?.userId === data?.userId;
      });
      console.log({ user });
      user.peer.signal(data?.signal);
    });
  }, [socket]);

  console.log({ allPeople });

  useEffect(() => {
    let allPeers = peers.map((item) => {
      return addPeer(item?.signal, myStreamRef.current, item?.userId);
    });
    allPeople.current = allPeers;
  }, [peers]);

  const addPeer = (incomingSignal: any, stream: any, userId: string) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log(userId);
      socket.emit("reverse-signal", { signal, userId });
    });

    peer.signal(incomingSignal);

    return {
      peer,
      userId,
    };
  };

  const handleWindowUnload = (event: any) => {
    event.preventDefault();
    myPeerRef?.current?.close();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowUnload, {
      capture: true,
    });
    return () => {
      window.removeEventListener("beforeunload", handleWindowUnload, {
        capture: true,
      });
    };
  }, []);

  console.log({ allPeople });

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
          {allPeople?.current?.map((people, index) => (
            <Video peer={people?.peer} key={index} />
          ))}

          {/* <video
            ref={remoteVideo}
            className={` ${
              remoteVideo?.current ? "h-[90vh]  w-full" : "block"
            }  transition-all ease-in-out object-cover duration-300 `}
            autoPlay={true}
          /> */}
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
    console.log("video");
    props?.peer.on("stream", (stream: any) => {
      console.log({ stream });
      ref.current.srcObject = stream;
    });
  }, [props?.peer, ref.current]);

  return (
    <video
      ref={ref}
      className={` transition-all ease-in-out object-cover duration-300 h-[10rem] w-[10rem] `}
      autoPlay={true}
    />
  );
};
