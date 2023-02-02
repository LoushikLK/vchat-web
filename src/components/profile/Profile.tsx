import { Avatar } from "@chakra-ui/react";

const additionalInfo = [
  {
    id: 0,
    title: "Joined",
    count: "22-Jan-2022",
  },
  {
    id: 5,
    title: "Role",
    count: "User",
  },
  {
    id: 1,
    title: "Total Class Taken",
    count: "62",
  },
  {
    id: 2,
    title: "Total assignment created",
    count: "23",
  },
];

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
        {additionalInfo?.map((item) => (
          <div
            key={item.id}
            className={`flex px-5 py-3 justify-between items-center w-full    ${
              item?.id === 1 ? "border-t border-b" : "border-b"
            }`}
          >
            <p className="text-themeDarkBlue font-semibold ">{item?.title}</p>
            <p className="text-themeSecondary font-semibold text-sm">
              {item?.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
