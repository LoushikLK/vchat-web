import { VideoChat } from "components/chat";
import Waiting from "components/chat/Waiting";
import useAppState from "context/useAppState";
import { VideoContextProvider } from "context/useVideoContext";
import { useSWRFetch } from "hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomType from "types/room";

export type RoomDataType = {
  data: RoomType;
};
const CallView = () => {
  const { roomId } = useParams();
  const { data, mutate } = useSWRFetch<RoomDataType>(`room/${roomId}`);
  const { socket } = useAppState();
  const [videoScreen, setVideoScreen] = useState(false);

  useEffect(() => {
    socket.emit("room-connected", {
      roomId,
    });
  }, [roomId, socket]);

  return (
    <VideoContextProvider>
      {videoScreen ? (
        <div className="min-w-screen min-h-screen  text-white bg-gray-900  ">
          <div className="sticky top-0 z-[9998] w-full border-r bg-purple-800 border-white">
            <h3 className="font-medium tracking-wide text-lg p-4 bg-theme ">
              {data?.data?.title || "Anonymous"}
            </h3>
          </div>
          <VideoChat
            classId={roomId?.toString()}
            data={data?.data}
            revalidate={mutate}
          />
        </div>
      ) : (
        <Waiting
          roomId={roomId}
          data={data?.data}
          setVideoScreen={setVideoScreen}
        />
      )}
    </VideoContextProvider>
  );
};

export default CallView;
