import { Address, Profile } from "components/profile";

const ProfilePage = () => {
  return (
    <section className="w-full mb-10 container mx-auto ">
      <div className="w-full h-52 relative">
        <div className="main-container absolute top-1/2 w-full flex left-0 right-0 items-center justify-center py-6 md:py-10">
          <div className="w-full flex justify-center gap-8">
            <div className=" max-w-md w-full rounded-xl">
              <Profile />
            </div>
            <div className="w-full ">
              <Address />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
