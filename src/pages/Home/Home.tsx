import { Button, Input } from "@chakra-ui/react";
import { CreateRoom } from "components/home";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [roomId, setRoomId] = useState("63e87ce7c7fae66a55d23a6a");

  const { mutate } = useFetch();

  const { socket, user } = useAppState();

  const navigation = useNavigate();

  const handleJoinRoom = async () => {
    try {
      if (!roomId) throw new Error("Enter a valid room Id");

      const res = await mutate({
        path: "room/join/" + roomId,
        method: "PUT",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);
      if (!res?.data?.data?.data?.joined) {
        toast.success(res?.data?.message);
        socket.emit("join-waiting-room", {
          roomId,
          userId: user?._id,
        });
        return;
      }
      toast.success(res?.data?.message);
      navigation(`/call/${roomId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  const handleViewToastify = async (roomId: string) => {
    try {
      const res = await mutate({
        path: "room/" + roomId,
        method: "GET",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);

      toast.success(
        <div className="flex items-center gap-4 ">
          <h3 className="font-medium tracking-wide text-sm">
            You can now join
            {" " + res?.data?.data?.data?.title ||
              res?.data?.data?.data?.createdBy?.displayName}
            's room
          </h3>
          <div className="flex items-center gap-1">
            <Button
              colorScheme="whatsapp"
              size={"xs"}
              onClick={() => navigation(`/call/${roomId}`)}
            >
              Join
            </Button>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("room-accepted", (data: any) => {
      if (!data?.roomId) return;
      handleViewToastify(data?.roomId);
    });
  }, [socket]);

  return (
    <section className="min-h-[90vh]  flex items-center justify-center ">
      <div className="flex flex-col gap-4 bg-white rounded-lg p-4 items-center shadow-lg max-w-lg w-full ">
        <h3 className="text-center text-blue-500 text-2xl font-semibold border-b pb-4 w-full mb-4">
          Start A Chat
        </h3>
        <div className="flex items-center w-full gap-4">
          <Input
            placeholder="Enter join Id"
            value={roomId}
            onChange={(e) => setRoomId(e?.target?.value?.trim())}
          />

          <Button colorScheme="messenger" onClick={handleJoinRoom}>
            Join Room
          </Button>
        </div>
        <CreateRoom />
        <Button colorScheme="messenger" className="!w-full">
          Join Random
        </Button>
      </div>
    </section>
  );
};

export default Home;
