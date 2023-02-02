import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

const ProtectedLayout = ({ children }: Props) => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="w-full bg-blue-700">
        <div className="flex h-16 items-center justify-between px-4  ">
          <h1 className="hidden text-xl lg:block text-white ">Welcome Back!</h1>
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
                <MenuItem>
                  <Button
                    colorScheme="messenger"
                    className="!w-full flex justify-start gap-4"
                  >
                    <Avatar size={"xs"} />
                    <p className="text-xs font-medium w-full text-left  text-white">
                      Loushik
                    </p>
                  </Button>
                </MenuItem>
                <MenuItem>
                  <p className="text-xs px-4 font-medium text-gray-600">
                    lk@lk.com
                  </p>
                </MenuItem>
                <MenuItem>
                  <p className="text-xs px-4 font-medium text-gray-600">
                    Change Password
                  </p>
                </MenuItem>
                <MenuItem className="hover:!bg-red-500 group ">
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
