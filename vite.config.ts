import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  base: "/Todo-App",
  build: {
   
    rollupOptions: {
      output: {
       
        manualChunks(id) {
         
          if (id.includes('@popperjs') || 
              id.includes('@zag-js') || 
              id.includes('aria-hidden') || 
              id.includes('focus-lock') || 
              id.includes('prop-types') || 
              id.includes('detect-node-es') || 
              id.includes('framesync') || 
              id.includes('get-nonce') || 
              id.includes('toggle-selection')) {
           
          }

          
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0]; 
          }
        }
      }
    },
   
    chunkSizeWarningLimit: 2000, 
  }
});
