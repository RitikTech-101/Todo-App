import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import './index.css';


const theme = extendTheme({
  config: {
    initialColorMode: 'light', //
    useSystemColorMode: false, // 
  },
  styles: {
    global: {
      
      'html, body': {
        color: 'black', 
        backgroundColor: 'gray.50', 
        transition: 'background-color 0.3s ease',
      },
      
      '[data-theme="dark"]': {
        'html, body': {
          backgroundColor: 'blue.800', 
          color: 'FFF2C2', 
        },
      },
      
      '[data-theme="rainbow"]': {
        'html, body': {
          backgroundImage:
            'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #00ff00, #0066ff, #7a00ff)', // Rainbow gradient
          backgroundSize: '400% 400%',
          animation: 'rainbow 5s ease infinite', 
        },
      },
    },
  },
  colors: {
    rainbow: {
      50: '#ff0000',
      100: '#ff7300',
      200: '#fffb00',
      300: '#00ff00',
      400: '#0066ff',
      500: '#7a00ff',
      600: '#0000ff',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
