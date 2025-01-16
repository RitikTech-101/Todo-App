import React, { useState, useEffect } from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon, ViewIcon } from '@chakra-ui/icons';

const ThemeToggler: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isRainbowMode, setIsRainbowMode] = useState(false);

  useEffect(() => {
    if (isRainbowMode) {
      document.body.setAttribute('data-theme', 'rainbow');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isRainbowMode]);

  const toggleTheme = () => {
    if (isRainbowMode) {
      setIsRainbowMode(false);
    } else {
      toggleColorMode();
    }
  };

  const toggleRainbowMode = () => {
    setIsRainbowMode(!isRainbowMode);
  };

  const icon = isRainbowMode ? (
    <ViewIcon />
  ) : colorMode === 'dark' ? (
    <MoonIcon />
  ) : (
    <SunIcon />
  );

  return (
    <div>
      <IconButton
        aria-label="Toggle theme"
        icon={icon}
        position="absolute"
        top="4"
        right="4"
        onClick={toggleTheme}
        size="lg"
        zIndex={10}
      />
      <IconButton
        aria-label="Toggle rainbow mode"
        icon={<ViewIcon />}
        position="absolute"
        top="4"
        right="16"
        onClick={toggleRainbowMode}
        size="lg"
        zIndex={10}
      />
    </div>
  );
};

export default ThemeToggler;
