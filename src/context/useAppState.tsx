import { createContext, useContext, useEffect, useRef, useState } from "react";

const contextDefaultValues: any = {};

type APP_CONTEXT = {
  appLoading: boolean;
  peerConnection?: any;
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
  const peerConnection = useRef<any>(null);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(servers);
  }, []);

  return (
    <AppContext.Provider
      value={{
        appLoading,
        peerConnection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppState = () => {
  const { appLoading, peerConnection } = useContext(AppContext);

  return {
    appLoading,
    peerConnection: peerConnection?.current,
  };
};

export default useAppState;
