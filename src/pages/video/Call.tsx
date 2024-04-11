import { VideoChat } from "components/chat";
import { useSWRFetch } from "hooks";
import { useParams } from "react-router-dom";
import RoomType from "types/room";

export type RoomDataType = {
  data: RoomType;
};

const CallView = () => {
  const { roomId } = useParams();
  const { data, mutate } = useSWRFetch<RoomDataType>(`room/${roomId}`);
  return (
    <div className="min-w-screen min-h-screen  text-white bg-gray-900  ">
      <div className="absolute top-0 z-50 w-full border-r border-white">
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
  );
};

export default CallView;
