import { BASE_URL } from "config";
import {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { connect } from "socket.io-client";

import UserType from "types/user";

const contextDefaultValues: any = {};

type APP_CONTEXT = {
  appLoading: boolean;
  peerConnection: MutableRefObject<RTCPeerConnection | null>;
  user: UserType | null;
  setUser: (arg: UserType) => void;
  socket?: any;
  navbarHight: number;
  setNavbarHeight: (arg: number) => void;
};

// const socketServer = `ws://192.168.29.82:8000/`;
const socketServer = `wss://vchat-server.onrender.com/`;

const AppContext = createContext<APP_CONTEXT>(contextDefaultValues);
type Props = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: Props) => {
  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [navbarHight, setNavbarHeight] = useState(0);

  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = connect(socketServer);

    socket?.current?.on("connect", () => {
      if (!user?._id) return;
      socket?.current?.emit("user-connected", user?._id);
    });
  }, [user?._id]);

  useEffect(() => {
    (async () => {
      try {
        let ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");
        if (!ACCESS_TOKEN) throw new Error("No access token found");
        let response = await fetch(BASE_URL + `my-account`, {
          headers: {
            authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        let data = await response?.json();
        if (response?.status !== 200) {
          setUser(null);
        }

        setUser(data?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setAppLoading(false);
      }
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{
        appLoading,
        peerConnection,
        user,
        setUser,
        socket: socket?.current,
        setNavbarHeight,
        navbarHight,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppState = () => {
  const {
    appLoading,
    peerConnection,
    user,
    setUser,
    socket,
    setNavbarHeight,
    navbarHight,
  } = useContext(AppContext);

  return {
    appLoading,
    peerConnection: peerConnection?.current,
    user,
    setUser,
    socket,
    setNavbarHeight,
    navbarHight,
  };
};

export default useAppState;
