import { Button, Input } from "@chakra-ui/react";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [roomId, setRoomId] = useState("638c0fdc36f34b855b06afec");

  const { mutate } = useFetch();

  const { socket } = useAppState();

  const navigation = useNavigate();

  const handleJoinRoom = async () => {
    try {
      if (!roomId) throw new Error("Enter a valid room Id");

      const res = await mutate({
        path: "join/" + roomId,
        method: "POST",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);
      toast.success(res?.data?.message);
      navigation(`/call/${roomId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center ">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Enter join Id"
            value={roomId}
            onChange={(e) => setRoomId(e?.target?.value?.trim())}
          />

          <Button colorScheme="messenger" onClick={handleJoinRoom}>
            Join Room
          </Button>
        </div>
        <Button colorScheme="messenger">Create Room</Button>
        <Button colorScheme="messenger">Join Random</Button>
      </div>
    </section>
  );
};

export default Home;
