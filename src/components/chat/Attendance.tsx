import { Close } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";

const AttendanceDetails = ({
  allUsers,
  closeFn,
}: {
  allUsers?: any[];
  closeFn?: () => void;
}) => {
  return (
    <div className="w-full relative min-h-screen border-l-gray-700 shadow-lg !bg-gray-800 border-l">
      <div className="flex justify-between w-full bg-theme  items-center">
        <h3 className="font-medium tracking-wide text-lg p-4  ">
          Student Attendance
        </h3>
        <IconButton onClick={closeFn}>
          <Close />
        </IconButton>
      </div>
      <div className="flex items-center gap-4 flex-wrap ">
        {allUsers
          ?.filter((item) => item?.isPresent)
          ?.map((item) => (
            <div
              className="flex flex-col items-center p-4 gap-4"
              key={item?.student?._id}
            >
              <Avatar
                src={item?.student?.photoUrl}
                alt="student"
                imgProps={{
                  loading: "lazy",
                }}
              >
                {item?.student?.displayName[0]}
              </Avatar>
              <h3 className="font-medium tracking-wide text-medium">
                {item?.student?.displayName}
              </h3>
              {item?.timeOfEnter && (
                <small className="font-medium tracking-wide ">
                  Joined At {new Date(item?.timeOfEnter).toLocaleTimeString()}
                </small>
              )}
              {item?.timeOfExit && (
                <small className="font-medium tracking-wide ">
                  Last exit {new Date(item?.timeOfExit).toLocaleTimeString()}
                </small>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AttendanceDetails;
