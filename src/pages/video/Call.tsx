import { VideoChat } from "components/chat";
import { useSWRFetch } from "hooks";
import { useParams } from "react-router-dom";
import RoomType from "types/room";

type RoomDataType = {
  data: RoomType;
};

const CallView = () => {
  const { roomId } = useParams();
  const { data } = useSWRFetch<RoomDataType>(`room/${roomId}`);
  return (
    <div className="min-w-screen min-h-screen  text-white bg-gray-900  ">
      <div className="absolute top-0 z-50 w-full border-r border-white">
        <h3 className="font-medium tracking-wide text-lg p-4 bg-theme ">
          {data?.data?.createBy?.displayName || "Anonymous"}
          {"'"}s Room
        </h3>
      </div>
      <VideoChat classId={roomId?.toString()} />
    </div>
  );
};

export default CallView;
