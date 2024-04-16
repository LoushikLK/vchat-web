import { BASE_URL, SOCKET_SERVER } from "config";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect, Socket } from "socket.io-client";
import UserType from "types/user";

const contextDefaultValues: any = {};

type APP_CONTEXT = {
  appLoading: boolean;
  user: UserType | null;
  setUser: (arg: UserType) => void;
  socket: Socket<any, any>;
  navbarHight: number;
  setNavbarHeight: (arg: number) => void;
};

const AppContext = createContext<APP_CONTEXT>(contextDefaultValues);
type Props = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: Props) => {
  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [navbarHight, setNavbarHeight] = useState(0);

  const socket = useRef<Socket<any, any> | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    socket.current = connect(SOCKET_SERVER);

    socket?.current?.on("connect", () => {
      if (!user?._id) return;
      socket?.current?.emit("user-connected", user?._id);
    });

    // socket?.current?.onAny((event, ...args) => {
    //   console.log(event, args);
    // });
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
          navigate("/");
        }

        setUser(data?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setAppLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        appLoading,
        user,
        setUser,
        socket: socket?.current as Socket<any, any>,
        setNavbarHeight,
        navbarHight,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppState = () => {
  const { appLoading, user, setUser, socket, setNavbarHeight, navbarHight } =
    useContext(AppContext);

  return {
    appLoading,
    user,
    setUser,
    socket,
    setNavbarHeight,
    navbarHight,
  };
};

export default useAppState;
