import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import logoimg from '../assets/bg removed.png';

const FooterContainer = styled.footer`
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.5); /* Adjust opacity as needed */
  color: black;
`;

const Footer = () => {
  return (
    <FooterContainer className='mx-auto md:pb-3 p-5 pb-0'>
      {/* Your footer content goes here */}
      <div className='grid place-content-center md:place-items-center md:grid-cols-4 w-full gap-10 mx-auto mb-10 md:mb-0'>
      <img className='text-right pb-0 aspect-auto max-w-xs max-h-xs' src={logoimg} alt="" />
      <div className='flex gap-4 flex-col justify-start'>
        <h5 className='font-semibold text-lg'>Kanha Milk Testing Equipments Private Limited</h5>
        <p className='w-4/5 text-sm'>1, Kanha Milk Testing Equipments Private Limited, Pallav Vihar, Near Bhoor, Bulandshahr - 203001, Uttar Pradesh, India</p>
      </div>
      <div className='flex flex-col justify-start gap-y-3'>
        <h5 className='font-semibold text-lg'>Contact Us</h5>
        <ul>
          <li>Email: info@kanhainstruments.com</li>
          <li>Phone: +91 9412857986</li>
        </ul>
      </div>
      <div className='flex flex-col gap-y-3'>
        <h5 className='font-semibold text-lg'>Social Media</h5>
        <div className='flex flex-row gap-x-5'>
        <a href="https://www.facebook.com/kanhamilktestingequipments" target='_blank'>
            <FaFacebook  className='hover:text-blue-600 transition-all animate-bounce duration-500 ease-in-out' size={30}/>
        </a>
        <a href="https://www.instagram.com/kanhamilktestingequipment" target='_blank'>
            <FaInstagram  className='hover:text-pink-600 transition-all animate-spin duration-500 ease-in-out' size={30}/>
        </a>
        <a href="https://twitter.com/TestingMilk" target='_blank'>
            <FaTwitter  className='hover:text-blue-500 transition-all animate-pulse duration-500 ease-in-out' size={30}/>
        </a>
        <a href="https://www.linkedin.com/company/83045334/admin/feed/posts" target='_blank'>
          <FaLinkedin  className='hover:text-blue-600 transition-all animate-bounce duration-500 ease-in-out' size={30}/>
        </a>
        </div>
      </div>
      </div>
      <hr class="h-full w-full border-r border-gray-900"/>

      <div className='flex items-center flex-col mx-auto text-center mt-5'>
        <p>&copy; 2024 Kanha Milk Testing Equipments Private Limited. All Rights Reserved.</p>
      </div>
    </FooterContainer>
  );
};

export default Footer;
