import React, { useState } from "react";
import { Link } from "react-router-dom";
export interface NavLinkItem {
  id: string;
  title: string;
  to: string;
}

interface NavbarProps {
  links: NavLinkItem[];
  sticky?: boolean;
  offsetY?: number; // for scroll offsets if needed
}

const Navbar: React.FC<NavbarProps> = ({
  links,
  sticky = true,
  offsetY = 0,
}) => {
  const [toggle, setToggle] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: offsetY, behavior: "instant" });
    setToggle(false);
  };

  return (
    <nav
      id="navbar"
      className={`w-full flex py-3 pb-14 justify-between items-center pl-4 pr-8 ${
        sticky ? "sticky top-0 z-50" : ""
      } bg-gradient-to-b from-black/100 to-black/0`}
    >

      {/* Desktop Menu */}
      <ul className="hidden sm:flex items-center flex-1 justify-end gap-8">
        {links.map((nav) => (
          <li key={nav.id}>
            <Link
              to={nav.to}
              onClick={handleScrollToTop}
              className={`font-poppins text-primary-reddish text-sm lg:text-lg`}
            >
              {nav.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <div className="sm:hidden flex items-center">
        <button
          className="w-7 h-7"
          onClick={() => setToggle((prev) => !prev)}
        >
          {toggle ? "✕" : "☰"} {/* simple hamburger / close */}
        </button>

        <div
          className={`${
            toggle ? "flex" : "hidden"
          } absolute top-16 right-4 p-4 bg-black-gradient rounded-xl flex-col gap-4 z-20`}
        >
          {links.map((nav) => (
            <Link
              key={nav.id}
              to={nav.to}
              onClick={handleScrollToTop}
              className={`font-poppins text-white text-base`}
            >
              {nav.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
