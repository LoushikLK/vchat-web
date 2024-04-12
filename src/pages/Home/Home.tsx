import { Groups, Phone, Videocam } from "@mui/icons-material";
import { VIDEO_ANIMATION } from "assets/animations";
import { JoinCall, MeetRandom } from "components/home";
import { useState } from "react";
import Lottie from "react-lottie";
import CreateRoom from "../../components/home/CreateRoom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: VIDEO_ANIMATION,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const viewItem = [
  <Lottie options={defaultOptions} height={450} width={450} />,
  <CreateRoom />,
  <JoinCall />,
  <MeetRandom />,
];

const Home = () => {
  const [currentView, setCurrentView] = useState(0);

  return (
    <section className="min-h-[90vh]  flex items-center justify-center main-container ">
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 p-10">
          <h1 className="text-4xl text-center font-bold mb-8">
            Call anyone everyone with just a click
          </h1>
          <div className="flex flex-col space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={() => setCurrentView(1)}
            >
              <Videocam sx={{ fontSize: 20 }} className="mr-2" />
              Start a New Call
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={() => setCurrentView(2)}
            >
              <Phone sx={{ fontSize: 20 }} className="mr-2" />
              Join a Call
            </button>
            {/* <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={() => setCurrentView(3)}
            >
              <Event sx={{ fontSize: 20 }} className="mr-2" />
              Schedule a Meeting
            </button> */}
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={() => setCurrentView(3)}
            >
              <Groups sx={{ fontSize: 20 }} className="mr-2" />
              Meet People
            </button>
          </div>
        </div>
        <div className="w-1/2">{viewItem[currentView]}</div>
      </div>
    </section>
  );
};

export default Home;
