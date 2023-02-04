import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { EditIcon } from "assets/Icons";
import useAppState from "context/useAppState";
import { ChangeEvent, Dispatch, useRef } from "react";
import { toast } from "react-toastify";
import { formatDate } from "utils";

const Profile = ({
  setUserImage,
  userImage,
}: {
  userImage: any;
  setUserImage: Dispatch<any>;
}) => {
  const { user } = useAppState();
  const inputRef = useRef<any>(null);
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setUserImage(event?.target?.files ? event?.target?.files[0] : null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div className="w-full flex gap-2 flex-col items-center bg-white justify-center rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] border pt-8 pb-5">
      <Avatar
        src={userImage ? URL.createObjectURL(userImage) : user?.photoUrl}
        sx={{ width: "7rem", height: "7rem" }}
      >
        <AvatarBadge
          bg="gray"
          boxSize="2rem"
          className="!cursor-pointer"
          onClick={() => inputRef?.current?.click()}
        >
          <EditIcon />
        </AvatarBadge>
      </Avatar>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="opacity-0 h-0 "
      />
      <div className="flex flex-col text-center justify-center items-center w-full">
        <p className="text-xl font-semibold">{user?.displayName}</p>
        <p className="text-theme">{user?.email}</p>
      </div>
      <div className="flex flex-col w-full pt-4">
        <div
          className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
        >
          <p className=" font-semibold ">Joined</p>
          <p className=" font-semibold text-sm">
            {user?.createdAt ? formatDate(user?.createdAt) : "Unknown"}
          </p>
        </div>
        <div
          className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
        >
          <p className=" font-semibold ">Email Verified</p>
          <p className=" font-semibold text-sm">
            {user?.emailVerified ? "Yes" : "No"}
          </p>
        </div>
        <div
          className={`flex px-5 py-3 justify-between items-center w-full border-b
            `}
        >
          <p className=" font-semibold ">Phone Verified</p>
          <p className=" font-semibold text-sm">
            {user?.phoneNumberVerified ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
