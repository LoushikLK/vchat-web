import { ReactNode } from "react";
import Header from "./Header";
import Hero from "./Hero";

type Props = {
  children: ReactNode | ReactNode[];
};

const PublicLayout = ({ children }: Props) => {
  return (
    <section className="w-full">
      <Header />
      <Hero />
      <main className="">{children}</main>
    </section>
  );
};

export default PublicLayout;
