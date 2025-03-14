import { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';  
import '/public/assets/css/main.css';
import '/public/assets/css/noscript.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {

      // Ensure jQuery is available globally
      window.jQuery = window.$ = require('/public/assets/js/jquery.min.js');

      setTimeout(() => {
        require('/public/assets/js/jquery.scrollex.min.js');
        require('/public/assets/js/jquery.scrolly.min.js');
        require('/public/assets/js/browser.min.js');
        require('/public/assets/js/breakpoints.min.js');
        require('/public/assets/js/util.js');
        require('/public/assets/js/main.js');

        // Delay `.fade-in` effect until after hydration
        document.getElementById('wrapper')?.classList.remove('fade-in');
      }, 100);
    
  }, []);

  return <Component {...pageProps} />;
}


