import { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

const ProtectedLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default ProtectedLayout;
