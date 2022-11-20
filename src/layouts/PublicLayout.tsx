import { HEROANIMATION } from "assets/animations";
import { ReactNode } from "react";
import Lottie from "react-lottie";
import Header from "./Header";

type Props = {
  children: ReactNode | ReactNode[];
};
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: HEROANIMATION,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const PublicLayout = ({ children }: Props) => {
  return (
    <section className="w-full">
      <Header />
      <main className="">
        <section className="w-full h-[90vh]">
          <div className="h-full w-full flex">
            <div className="w-1/2 h-full flex justify-center items-center">
              <Lottie options={defaultOptions} height={400} width={400} />
            </div>
            {children}
          </div>
        </section>
      </main>
    </section>
  );
};

export default PublicLayout;
