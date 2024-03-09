import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StaggeredOption = ({ mainText, options, openOption, setOpenOption, handleOptionClick, handleGlassMenuClose }) => {
  const [open, setIsOpen] = useState(openOption === mainText);
  // const isOpen = open && openOption === mainText;
  
  const toggleOpen = () => {
    setIsOpen(!open);
    setOpenOption(open ? null : mainText); // Set openOption to null if isOpen is true, otherwise set it to mainText
    handleOptionClick(mainText);
  };

  return (
    <div
      className="p-8 pl-10 pr-10 pb-2 flex text-xl items-center justify-center"
      // onClick={() => handleOptionClick(mainText)}
      // onMouseLeave={() => setOpen(false)}
    >
      <motion.div animate={open ? 'open' : 'closed'} className="relative">
        <button onClick={toggleOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors"
        >
          <span className="font-medium ">{mainText}</span>
          <motion.span variants={iconVariants}>
            <FiChevronDown />
          </motion.span>
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: 'top', translateX: '-50%', maxHeight: '400px', overflowY: 'auto'  }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden scrollbar"
        >
          {open && options.map((option, index) => (
            <Option key={index} handleGlassMenuClose={handleGlassMenuClose} Icon={option.icon} text={option.name} link={option.link} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

const Option = ({ text, Icon, link, handleGlassMenuClose }) => (
  <Link to={link} onClick={() => {handleGlassMenuClose(); }}>
    <motion.li
      variants={itemVariants}
      className="flex items-center gap-2 w-full p-2 text-sm font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  </Link>
);

export default StaggeredOption;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.001,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.001,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: 'afterChildren',
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
