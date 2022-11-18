import { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode | ReactNode[];
};

const PublicLayout = ({ children }: Props) => {
  return (
    <section className="w-full">
      <Header />
      <main className="">{children}</main>
    </section>
  );
};

export default PublicLayout;
