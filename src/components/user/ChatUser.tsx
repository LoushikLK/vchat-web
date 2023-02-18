import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
} from "@chakra-ui/react";
import useAppState from "context/useAppState";

import { useFetch } from "hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChatUser = ({ roomId, active }: { roomId?: string; active: boolean }) => {
  const { navbarHight, socket, user } = useAppState();
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [reFetch, setRefetch] = useState(false);

  const { mutate } = useFetch();
  useEffect(() => {
    (async () => {
      if (!active) return;

      try {
        const res = await mutate({
          path: `room/${roomId}`,
          method: "GET",
        });

        if (res?.status !== 200) throw new Error(res?.data?.error);

        setWaitingUsers(res?.data?.data?.data?.waitingUsers);
        setJoinedUsers(res?.data?.data?.data?.joinedUsers);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    })();
  }, [roomId, active, reFetch, mutate]);

  const handleReject = async (userId?: string) => {
    try {
      const res = await mutate({
        path: `room/reject/${roomId}/${userId}`,
        method: "PUT",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);

      toast.success(res?.data?.message);
      setRefetch((prev) => !prev);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const handleRemove = async (userId?: string) => {
    try {
      const res = await mutate({
        path: `room/remove/${roomId}/${userId}`,
        method: "PUT",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);

      toast.success(res?.data?.message);
      setRefetch((prev) => !prev);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const handleAccept = async (userId?: string) => {
    try {
      const res = await mutate({
        path: `room/private/join/${roomId}/${userId}`,
        method: "PUT",
      });
      if (res?.status !== 200) throw new Error(res?.data?.error);

      toast.success(res?.data?.message);

      socket.emit("user-accepted", {
        roomId,
        userId,
      });

      setRefetch((prev) => !prev);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("user-added-to-waiting", (data: any) => {
      setRefetch((prev) => !prev);
    });
  }, [socket]);

  return (
    <div
      style={{
        height: `${window.innerHeight - navbarHight}px`,
        top: `${navbarHight}px`,
      }}
      className={` ${
        active ? "w-[500px]" : "w-0 "
      } h-full   transition-all ease-in-out fixed right-0  z-[9999] duration-300 `}
    >
      <div
        style={{
          height: `${window.innerHeight - navbarHight}px`,
        }}
        className="w-full relative h-full border-l bg-gray-900 "
      >
        <Accordion allowToggle defaultIndex={[0]}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <h3 className="font-medium tracking-wide text-lg flex items-center justify-start pl-4  h-[50px] ">
                    Users
                  </h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <div className="flex flex-col gap-4 border-t border-t-white py-4">
                {joinedUsers?.map((item: any) => {
                  if (item?._id !== user?._id) {
                    return (
                      <div
                        className="flex items-center justify-between gap-4"
                        key={item?._id}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar size={"sm"} src={item?.photoUrl} />
                          <h3 className="font-medium  tracking-wide text-sm">
                            {item?.displayName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {item?.createdBy?._id === user?._id ? (
                            <Button
                              colorScheme="red"
                              size={"xs"}
                              onClick={() => handleRemove(item?._id)}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <h3 className="font-medium tracking-wide text-lg flex items-center justify-start pl-4  h-[50px] ">
                    Waiting
                  </h3>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <div className="flex flex-col gap-4 border-t border-t-white py-4">
                {waitingUsers?.map((item: any) => (
                  <div
                    className="flex items-center justify-between gap-4"
                    key={item?._id}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar size={"sm"} src={item?.photoUrl} />
                      <h3 className="font-medium  tracking-wide text-sm">
                        {item?.displayName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        colorScheme="red"
                        size={"xs"}
                        onClick={() => handleAccept(item?._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        colorScheme="whatsapp"
                        size={"xs"}
                        onClick={() => handleReject(item?._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ChatUser;
