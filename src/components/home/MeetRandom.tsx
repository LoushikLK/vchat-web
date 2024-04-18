import { Button } from "@mui/material";
import { MEET_PEOPLE } from "assets/animations";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: MEET_PEOPLE,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const MeetRandom = () => {
  const navigate = useNavigate();

  const handleFindRoom = () => {
    navigate(`/call/random`);
  };

  return (
    <div className="w-fill flex items-center justify-center gap-4 flex-col">
      <Lottie options={defaultOptions} height={450} width={450} />
      <Button
        variant="contained"
        fullWidth
        className="!bg-gray-600 !mb-4 !text-white"
        onClick={handleFindRoom}
      >
        Find
      </Button>
    </div>
  );
};

export default MeetRandom;
