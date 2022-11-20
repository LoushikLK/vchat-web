import { LOGO } from "assets";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section className="h-16 w-full border-b-2 px-12 shadow-md">
      <div className="flex justify-between items-center h-full">
        <img className="h-7 w-28 object-contain" src={LOGO} alt="" />
        <ul className="flex gap-4 text-sm font-semibold text-gray-700">
          <li className="cursor-pointer hover-custom">New to vChat?</li>
          <li className="text-blue-500 cursor-pointer hover-custom">
            <Link to={"/login"}>Sign In</Link>
          </li>
          <li className="text-blue-500 cursor-pointer hover-custom">
            <Link to={"/register"}>Sign Up Free</Link>
          </li>
          <li className="text-blue-500 cursor-pointer hover-custom">Support</li>
        </ul>
      </div>
    </section>
  );
};

export default Header;
