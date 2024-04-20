import { Random, RandomWaiting } from "components/random";
import { VideoContextProvider } from "context/useVideoContext";
import { useFetch } from "hooks";
import { useEffect, useState } from "react";
import RoomType from "types/room";

export type RoomDataType = {
  data: RoomType;
};
const CallRandom = () => {
  const [roomId, setRoomId] = useState("");
  const [videoScreen, setVideoScreen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const { mutate } = useFetch();

  useEffect(() => {
    if (roomId || !videoScreen) return;

    const interVal = setTimeout(async () => {
      try {
        const res = await mutate({
          method: "GET",
          path: `room/random`,
        });

        if (res?.status !== 200) throw new Error(res?.data?.error);

        setRoomId(res?.data?.data?.data?._id);
      } catch (error) {
        setRefetch((prev) => !prev);
      }
    }, 200);
    return () => clearTimeout(interVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, roomId, videoScreen]);

  return (
    <VideoContextProvider>
      {videoScreen && roomId ? (
        <div className="min-w-screen min-h-screen  text-white bg-gray-900  ">
          <div className="sticky top-0 z-[9998] w-full border-r bg-purple-800 border-white">
            <h3 className="font-medium tracking-wide text-lg p-4 bg-theme ">
              Meet Anonymous
            </h3>
          </div>
          <Random roomId={roomId} skipUser={() => setRoomId("")} />
        </div>
      ) : (
        <RandomWaiting setVideoScreen={setVideoScreen} />
      )}
    </VideoContextProvider>
  );
};

export default CallRandom;
