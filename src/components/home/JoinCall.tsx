import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JoinCall = () => {
  const [roomId, setRoomId] = useState("63e87ce7c7fae66a55d23a6a");

  const navigation = useNavigate();

  const handleJoinRoom = async () => {
    try {
      if (!roomId) throw new Error("Enter a valid room Id");
      navigation(`/call/${roomId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <div className="w-full p-4 shadow-xl rounded-xl bg-white">
      <h3 className="font-medium tracking-wide text-4xl p-4 text-center text-green-800">
        Join Call
      </h3>

      <div className="w-full p-4">
        <div className="w-full flex flex-col gap-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Room Id"
            name="Room Id"
            onChange={(e) => setRoomId(e?.target?.value)}
            value={roomId}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 w-full">
        <Button
          variant="contained"
          className="!bg-green-500 !hover:bg-green-600 !text-white"
          onClick={handleJoinRoom}
        >
          Join
        </Button>
      </div>
    </div>
  );
};

export default JoinCall;
