import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

const ProtectedLayout = ({ children }: Props) => {
  return (
    <>
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
                  <h4 className="text-sm">lk</h4>
                </MenuItem>
                <MenuItem>
                  <p className="text-xs font-medium text-gray-600">lk@lk.com</p>
                </MenuItem>
                <MenuItem>
                  <p className="text-xs font-medium text-gray-600">
                    Change Password
                  </p>
                </MenuItem>
                <MenuItem>
                  <p className="text-xs font-medium text-red-600">Logout</p>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default ProtectedLayout;
