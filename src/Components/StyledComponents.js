import styled from 'styled-components';
import { animated } from 'react-spring';

const MenuBar = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  height: 5rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5000;
`;

const GlassMenu = styled(animated.div)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: background 0.3s ease-out, backdrop-filter 0.3s ease-out, transform 0.3s ease-out;
  height: 100%;
  &.closing {
    transform: translateX(-100%);
  }
`;

const LogoutButton = styled.button`
  color: red;
  position: absolute;
  top: 4rem;
  right: 5rem;
  background: transparent;
  &:hover {
    background: red;
    color: white;
    border-color: transparent;
  }
`;

const MenuOpenButton = styled(animated.button)`
  &.menu-open-button {
    // your styles here
  }
`;

const StyledImage = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  margin-right: 3rem;
`;


export default {MenuBar, GlassMenu};