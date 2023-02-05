import { Avatar } from "@chakra-ui/react";
import { OptionIcon } from "assets/Icons";
import { useState } from "react";
import { formatDate } from "utils";

const MessageBox = ({
  type,
  message,
}: {
  type: "REPLY" | "OWN";
  message: any;
}) => {
  const [openOption, setOpenOption] = useState(false);

  if (type === "OWN") {
    return (
      <div className="w-full flex items-start justify-end  gap-2 p-4 ">
        <button
          className="cursor-pointer p-2 hover:bg-gray-100/20 bg-transparent duration-300 ease-in-out transition-all relative rounded-full "
          onClick={() => setOpenOption(!openOption)}
          onBlur={() => setOpenOption(false)}
        >
          <OptionIcon />
          {openOption && (
            <div className="absolute top-2 flex flex-col gap-2 text-black left-full shadow-xl rounded-md overflow-hidden bg-white">
              <span className="bg-white text-xs px-4 py-1 hover:bg-gray-100">
                Reply
              </span>
              <span className="bg-white text-xs px-4 py-1 hover:bg-gray-100">
                React
              </span>
            </div>
          )}
        </button>
        <span className="flex flex-col gap-1 max-w-[70%]  ">
          <small className="tracking-wide bg-gray-200 text-gray-900 rounded-l-full rounded-br-full p-2">
            {message?.message}
          </small>

          <small className=" ml-4 text-xs  text-blue-700 ">
            {formatDate(message?.createdAt, "time")}
          </small>
        </span>
        <Avatar size={"sm"} src={message?.sendBy?.photoUrl} loading="lazy" />
      </div>
    );
  } else {
    return (
      <div className="w-full flex items-start gap-2 p-4 " key={message?._id}>
        <Avatar size={"sm"} src={message?.sendBy?.photoUrl} loading="lazy" />
        <span className="flex flex-col gap-1  max-w-[70%] justify-end ">
          <small className="tracking-wide bg-blue-500 rounded-r-full rounded-bl-full p-2">
            {message?.message}
          </small>

          <small className=" ml-4 text-xs text-blue-700 text-right ">
            {formatDate(message?.createdAt, "time")}
          </small>
        </span>
        <button
          className="cursor-pointer p-2 hover:bg-gray-100/20 bg-transparent duration-300 ease-in-out transition-all relative rounded-full "
          onClick={() => setOpenOption(!openOption)}
          onBlur={() => setOpenOption(false)}
        >
          <OptionIcon />
          {openOption && (
            <div className="absolute top-2 flex flex-col gap-2 text-black left-full shadow-xl rounded-md overflow-hidden bg-white">
              <span className="bg-white text-xs px-4 py-1 hover:bg-gray-100">
                Reply
              </span>
              <span className="bg-white text-xs px-4 py-1 hover:bg-gray-100">
                React
              </span>
            </div>
          )}
        </button>
      </div>
    );
  }
};

export default MessageBox;
