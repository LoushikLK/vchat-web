import { Button } from "@chakra-ui/react";
import {
  Call,
  ChatOutlined,
  MicOutlined,
  People,
  VideoOutlined,
} from "assets/Icons";
import { VideoChat } from "components/chat";
import useAppState from "context/useAppState";
import { useFetch, useMounted } from "hooks";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CallUI = () => {
  const [drawerActive, setDrawerActive] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);

  const { roomId } = useParams();

  const { peerConnection, socket, user, navbarHight } = useAppState();

  const { mutate } = useFetch();

  const isMounted = useMounted();

  const myVideoRef = useRef<any>(null);
  const remoteStream = useRef<any>(null);
  const remoteVideo = useRef<any>(null);

  useEffect(() => {
    (async () => {
      if (!peerConnection) return;
      const localVideoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      remoteStream.current = new MediaStream();

      // Push tracks from local stream to peer connection
      localVideoStream?.getTracks().forEach((track) => {
        peerConnection?.addTrack(track, localVideoStream);
      });
      // Pull tracks from remote stream, add to video stream
      peerConnection.ontrack = (event: any) => {
        event.streams[0].getTracks().forEach((track: any) => {
          remoteStream.current.addTrack(track);
        });
      };
      myVideoRef.current.srcObject = localVideoStream;
      remoteVideo.current.srcObject = remoteStream.current;
    })();
  }, [peerConnection]);

  useEffect(() => {
    (async () => {
      try {
        let response = await mutate({
          path: `/room/${roomId}`,
          method: "GET",
        });

        if (response?.data?.error) throw new Error(response?.data?.error);

        setRoomData(response?.data?.data);

        if (!peerConnection) return;

        // Create offer
        const offerDescription = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offerDescription);

        const offer = {
          sdp: offerDescription?.sdp,
          type: offerDescription?.type,
        };

        peerConnection.onicecandidate = (event: any) => {
          socket.emit("join-new-room", {
            roomId,
            userId: user?._id,
            peerData: offer,
            candidate: event?.candidate,
          });
        };
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error?.message);
        }
      }
    })();
  }, [roomId, isMounted, peerConnection]);

  useEffect(() => {
    (async () => {
      if (!peerConnection) return;

      socket.on("user-joined", async (data: any) => {
        const offerDescription = data.peerData;

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
        );

        const answerDescription = await peerConnection?.createAnswer();
        await peerConnection?.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };

        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));

        peerConnection.onicecandidate = (event: any) => {
          socket.emit("exchange-peer", {
            roomId,
            peerData: answer,
            candidate: event?.candidate,
          });
        };
      });

      socket.on("peer-data", async (data: any) => {
        const offerDescription = data?.peerData;
        await peerConnection?.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
        );
        peerConnection?.addIceCandidate(new RTCIceCandidate(data?.candidate));
      });
    })();
  }, [peerConnection, socket, roomId]);

  return (
    <section className="w-full  relative text-white  ">
      <div className="w-full  flex">
        <div
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
              height: remoteVideo?.current
                ? "10rem"
                : `${window.innerHeight - navbarHight}px`,
              width: remoteVideo?.current ? "18rem" : `100%`,
            }}
            className={` ${
              remoteVideo?.current
                ? " absolute bottom-5 right-5 border-4 rounded-xl  bg-black "
                : "  w-full"
            }  transition-all ease-in-out object-cover duration-300 `}
            autoPlay={true}
          />
          <video
            ref={remoteVideo}
            className={` ${
              remoteVideo?.current ? "h-[90vh]  w-full" : "block"
            }  transition-all ease-in-out object-cover duration-300 `}
            autoPlay={true}
          />
        </div>

        <div
          style={{
            height: `${window.innerHeight - navbarHight}px`,
          }}
          className={` ${
            drawerActive ? "w-[500px]" : "w-0 hidden"
          } h-full   transition-all ease-in-out duration-300 `}
        >
          <VideoChat />
        </div>
        <div className="w-fit z-50 fixed bottom-12 left-1/2 -translate-x-1/2 ">
          <div className="flex items-center gap-4  p-4 bg-blue-500/50  rounded-md shadow-lg">
            <Button>
              <span>
                <People className="text-gray-900 text-4xl p-2 " />
              </span>
            </Button>
            <Button onClick={() => setDrawerActive(!drawerActive)}>
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
