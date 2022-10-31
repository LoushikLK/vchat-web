import { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

const PublicLayout = ({ children }: Props) => {
  return (
    <div className="w-full bg-gray-900">
      <nav className="flex w-full custom-container">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-center">
            <h3 className="font-bold text-4xl text-teal-500 tracking-wide">
              Vchat
            </h3>
          </div>
          <div className="flex gap-4 items-center"></div>
        </div>
      </nav>
      <main className="">{children}</main>
    </div>
  );
};

export default PublicLayout;
