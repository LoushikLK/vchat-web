import {
  AdminPanelSettings,
  Close,
  Delete,
  VideocamOff,
  VolumeMute,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import UserType from "types/user";

const AttendanceDetails = ({
  allUsers,
  closeFn,
}: {
  allUsers?: UserType[];
  closeFn?: () => void;
}) => {
  return (
    <div className="w-full relative min-h-screen border-l-gray-700 shadow-lg !bg-gray-800 border-l">
      <div className="flex justify-between w-full bg-theme  items-center">
        <h3 className="font-medium tracking-wide text-lg p-4  ">
          People{"'"}s
        </h3>
        <IconButton onClick={closeFn}>
          <Close />
        </IconButton>
      </div>
      <div className="flex items-start flex-col gap-4 p-4 overflow-hidden overflow-y-auto min-h-screen h-full ">
        {allUsers?.map((item) => (
          <div className="flex items-center bg-purple-400/50 gap-4 w-full  rounded-md">
            <div
              className="flex flex-col items-start w-1/3 p-4 gap-2"
              key={item?._id}
            >
              <Avatar
                src={item?.photoUrl}
                sx={{ width: 30, height: 30 }}
                alt="student"
                component={"image"}
              >
                {item?.displayName[0]}
              </Avatar>
              <small className=" tracking-wide ">{item?.displayName}</small>
            </div>
            <div className="flex gap-2 w-2/3">
              <IconButton className="h-10 w-10  !bg-orange-300">
                <AdminPanelSettings />
              </IconButton>
              <IconButton className="h-10 w-10 !bg-purple-300">
                <VolumeMute />
              </IconButton>
              <IconButton className="h-10 w-10 !bg-purple-300">
                <VideocamOff />
              </IconButton>
              <IconButton className="h-10 w-10 !bg-red-400 ">
                <Delete />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceDetails;
