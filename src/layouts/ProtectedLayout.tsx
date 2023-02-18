import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  children: ReactNode | ReactNode[];
};

const ProtectedLayout = ({ children }: Props) => {
  const navigation = useNavigate();

  const { user, setNavbarHeight } = useAppState();

  const { mutate } = useFetch();

  const navBar = useRef<any>(null);

  useEffect(() => {
    if (navBar?.current) {
      let height = navBar?.current?.clientHeight;
      setNavbarHeight(height);
    }
  }, [navBar?.current]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            const res = await mutate({
              path: "auth/logout",
              method: "PUT",
            });

            if (res?.status !== 200) throw new Error(res?.data?.error);

            localStorage.setItem("ACCESS_TOKEN", "");
            window.location.reload();
            // navigate("/");

            resolve(res);
          } catch (error) {
            reject(error);
          }
        }),
        {
          pending: "Logging out...",
          success: "Logged out successfully",
          error: "Log out failed",
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="w-full bg-blue-700" ref={navBar}>
        <div className="flex h-16 items-center justify-between px-4  ">
          <h1 className="hidden text-xl lg:block text-white ">Welcome Back!</h1>
          {user?._id}
          <div className="flex items-center gap-6">
            <Menu>
              <MenuButton
                className="!flex !items-center gap-4"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Profile
              </MenuButton>
              <MenuList>
                <MenuItem
                  className="!w-full flex justify-start gap-4 group !px-6 hover:!bg-blue-500 "
                  onClick={() => navigation("/profile")}
                >
                  <Avatar size={"xs"} src={user?.photoUrl} />
                  <p className="text-xs font-medium w-full text-left text-blue-500 flex items-center group-hover:!text-white">
                    {user?.displayName}
                  </p>
                </MenuItem>
                <MenuItem>
                  <p className="text-xs px-4 font-medium text-gray-600">
                    {user?.email}
                  </p>
                </MenuItem>
                <MenuItem>
                  <p
                    className="text-xs px-4 font-medium text-gray-600"
                    onClick={() => navigation("/change-password")}
                  >
                    Change Password
                  </p>
                </MenuItem>
                <MenuItem
                  className="hover:!bg-red-500 group "
                  onClick={handleLogout}
                >
                  <p className="text-xs px-4 font-medium group-hover:text-white text-red-600">
                    Logout
                  </p>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </header>
      <main className=" ">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
