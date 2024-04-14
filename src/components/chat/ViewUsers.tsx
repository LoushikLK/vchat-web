import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { Dispatch, SetStateAction } from "react";

const ViewUsers = ({
  remoteUsers,
  setRemoteUsers,
}: {
  remoteUsers: IAgoraRTCRemoteUser[];
  setRemoteUsers: Dispatch<SetStateAction<IAgoraRTCRemoteUser[]>>;
}) => {
  console.log({ remoteUsers });

  return (
    <div className="w-full bg-black min-h-screen flex gap-4 flex-wrap">
      {remoteUsers?.map((user: IAgoraRTCRemoteUser) => {
        return (
          <div className="w-1/4 h-1/4 min-w-72 min-h-72 " key={user.uid}>
            <video
              className="w-full h-full"
              autoPlay
              playsInline
              ref={(videoRef) =>
                videoRef ? user?.videoTrack?.play(videoRef) : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default ViewUsers;
