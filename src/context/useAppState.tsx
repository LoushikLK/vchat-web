import { BASE_URL } from "config";
import {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UserType from "types/user";

const contextDefaultValues: any = {};

type APP_CONTEXT = {
  appLoading: boolean;
  peerConnection: MutableRefObject<RTCPeerConnection | null>;
  user: UserType | null;
};

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const AppContext = createContext<APP_CONTEXT>(contextDefaultValues);
type Props = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: Props) => {
  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    (() => {
      peerConnection.current = new RTCPeerConnection(servers);
    })();

    return () => {
      peerConnection?.current?.close();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(BASE_URL + `my-account`);

        let data = await response?.json();
        if (response?.status !== 200) {
          setUser(null);
        }

        setUser(data);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppState = () => {
  const { appLoading, peerConnection, user } = useContext(AppContext);

  return {
    appLoading,
    peerConnection: peerConnection?.current,
    user,
  };
};

export default useAppState;
