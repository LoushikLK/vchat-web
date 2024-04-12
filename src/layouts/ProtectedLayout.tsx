import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import useAppState from "context/useAppState";
import { useFetch } from "hooks";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  children: ReactNode | ReactNode[];
};

const ProtectedLayout = ({ children }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <div className="bg-gray-100 min-h-screen">
      <header className="w-full bg-purple-700" ref={navBar}>
        <div className="flex h-16 items-center justify-between px-4  ">
          <Link to="/" className="hidden text-xl lg:block text-white ">
            Welcome Back!
          </Link>
          <div className="flex items-center gap-6">
            <div>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="!text-white"
              >
                Profile
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  className="!w-full flex justify-start gap-4 group !px-6 hover:!bg-purple-500 "
                  onClick={() => navigation("/profile")}
                >
                  <Avatar src={user?.photoUrl} />
                  <p className="text-xs font-medium w-full text-left text-purple-500 flex items-center group-hover:!text-white">
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
              </Menu>
            </div>
          </div>
        </div>
      </header>
      <main className=" ">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
