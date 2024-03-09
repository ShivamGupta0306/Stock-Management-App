import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import "../App.css";
import { FiEdit, FiShare, FiPlusSquare } from "react-icons/fi";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { SiTemporal } from "react-icons/si";
import { FaRegBuilding } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import StaggeredOption from "./StraggeredOption";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const BurgerMenu = () => {
  const [openOption, setOpenOption] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setOtherDropdown] = useState(false);
  const navigate = useNavigate();

  const options = [
    { name: "Company", link: "/company-list", icon: FaRegBuilding },
    { name: "Plant", link: "/plant-list", icon: TbBuildingSkyscraper },
    { name: "MCC", link: "/mcc-list", icon: FiShare },
    { name: "BMC", link: "/bmc-list", icon: FiEdit },
    { name: "Users", link: "/user-list", icon: FiPlusSquare },
    { name: "User-Role", link: "/user-role", icon: FiPlusSquare },
    { name: "User-Right", link: "/user-rights", icon: FiPlusSquare },
    { name: "User-Mapping", link: "/user-map", icon: FiPlusSquare },
    { name: "Item-Groups", link: "/item-groups", icon: LiaLayerGroupSolid },
    { name: "Items", link: "/items-list", icon: SiTemporal },
    { name: "Problem Type", link: "/problem-type", icon: FiShare },
  ];

  const option = [
    { name: "Inventory", link: "/transaction-list", icon: FaRegBuilding },
  ];

  const reports = [
    { name: "Transaction Report", link: "/transaction-report", icon: FiEdit },
    { name: "Stock Report", link: "/stock-report", icon: FiPlusSquare },
  ];

  const springProps = useSpring({
    transform: isMenuOpen ? "translateX(0%)" : "translateX(-100%)",
    config: { tension: 400, friction: 26 },
  });

  const handleOptionClick = (optionName) => {
    setOpenOption(openOption === optionName ? null : optionName); // Toggle the selected option
  };

  const MenuBar = styled.div`
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    height: 5rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10000;
  `;

  const GlassMenu = styled(animated.div)`
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    transition: background 0.3s ease-out, backdrop-filter 0.3s ease-out,
      transform 0.3s ease-out;
    height: 100%;
    z-index: 10000;
    &.closing {
      transform: translateX(-100%);
    }

    @media (max-width: 768px) {
      display: block; // Ensure the menu is displayed on small devices
    }
  `;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  const handleclick = (event) => {
    if (
      event.target.closest(".group") ||
      event.target.closest(".menu-open-button")
    ) {
      return;
    }

    setIsMenuOpen(false);
    setOpenOption(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleclick);

    return () => {
      document.removeEventListener("click", handleclick);
    };
  }, [isDropdownOpen, isDropdownOpen2]);

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
    localStorage.clear();
    navigate("/");
    // You can redirect to the logout page or perform any other logout actions
  };

  const LogoutButton = ({ onClick }) => {
    return (
      <button
        onClick={handleLogout}
        className=" text-red-500 absolute top-4 right-5 bg-transparent hover:bg-red-500 font-semibold hover:text-white py-2 px-4 flex justify-center items-center gap-x-2 border border-red-500 hover:border-transparent rounded"
      >
        Logout
        <FiLogOut />
      </button>
    );
  };

  const handleGlassMenuClose = () => {
    setIsMenuOpen(false);
    setOpenOption(false);
  };

  return (
    <>
      <MenuBar>
        <SwapButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <LogoutButton onClick={handleLogout} />
      </MenuBar>

      <GlassMenu
        style={springProps}
        isOpen={isMenuOpen}
        className={` text-black p-8 hidden md:block fixed left-0 ${
          isMenuOpen ? "" : "closing"
        }`}
      >
        {/* <Link to="/user-profile">
          <li className="flex justify-center items-center text-center h-20 hover:bg-[#B2B5E0] rounded-md list-none mb-4">
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold text-black text-2xl text-center"></span>
          </li>
        </Link> */}
        <div className="flex justify-center flex-col items-center">
          <div className="group block z-50">
            <StaggeredOption
              openOption={openOption}
              setOpenOption={setOpenOption}
              handleOptionClick={handleOptionClick}
              mainText="Masters"
              options={options}
              handleGlassMenuClose={handleGlassMenuClose}
            />
          </div>
          <div className="group block z-10">
            <StaggeredOption
              openOption={openOption}
              setOpenOption={setOpenOption}
              handleOptionClick={handleOptionClick}
              mainText="Transaction"
              options={option}
              handleGlassMenuClose={handleGlassMenuClose}
            />
          </div>
          <div className="group block">
            <StaggeredOption
              openOption={openOption}
              setOpenOption={setOpenOption}
              handleOptionClick={handleOptionClick}
              mainText="Reports"
              options={reports}
              handleGlassMenuClose={handleGlassMenuClose}
            />
          </div>
        </div>
      </GlassMenu>
    </>
  );
};

const SwapButton = ({ isMenuOpen, toggleMenu }) => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    setRotate(isMenuOpen ? 180 : 180);
  }, [isMenuOpen]);

  const buttonProps = useSpring({
    transform: `rotate(${rotate}deg)`,
  });

  return (
    <animated.button
      onClick={toggleMenu}
      className="menu-open-button focus:outline-none text-black p-7 rounded-md  fixed top-0 left-0"
      style={buttonProps}
    >
      {isMenuOpen ? (
        <svg
          className="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      ) : (
        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>
      )}
    </animated.button>
  );
};

export default BurgerMenu;
