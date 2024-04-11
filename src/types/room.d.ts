import UserType from "./user";

export default interface RoomType {
  _id: string;
  title: string;
  createBy: UserType;
  roomType: "PRIVATE" | "PUBLIC";
  joinedUsers: UserType[];
  waitingUsers: UserType[];
}
