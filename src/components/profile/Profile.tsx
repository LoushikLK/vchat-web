import { Avatar } from "@chakra-ui/react";

const Profile = () => {
  return (
    <div className="w-full flex gap-2 flex-col items-center bg-white justify-center rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] border pt-8 pb-5">
      <Avatar
        src="https://www.allisonacademy.com/wp-content/uploads/2021/12/Teacher-in-the-classroom.jpg"
        sx={{ width: "7rem", height: "7rem" }}
      >
        <p className="text-5xl">D</p>
      </Avatar>
      <div className="flex flex-col text-center justify-center items-center w-full">
        <p className="text-xl font-semibold">Dillip Sir</p>
        <p className="text-theme">dillipsir@gmail.com</p>
      </div>
      <div className="flex flex-col w-full pt-4">
        <div
          className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
        >
          <p className=" font-semibold ">Joined</p>
          <p className=" font-semibold text-sm">12 jan 2022</p>
        </div>
        <div
          className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
        >
          <p className=" font-semibold ">eee</p>
          <p className=" font-semibold text-sm">fvifri fberbfrb</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
