import { useEffect, useState } from 'react';
import '../styles/globals.css';
import '/public/assets/css/noscript.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    // Load jQuery and template scripts after hydration
    const loadScripts = async () => {
      window.jQuery = window.$ = require('/public/assets/js/jquery.min.js');

      require('/public/assets/js/jquery.scrollex.min.js');
      require('/public/assets/js/jquery.scrolly.min.js');
      require('/public/assets/js/browser.min.js');
      require('/public/assets/js/breakpoints.min.js');
      require('/public/assets/js/util.js');
      require('/public/assets/js/main.js');

      // Remove unwanted template elements like navPanel
      document.getElementById('navPanel')?.remove();
      document.getElementById('navPanelToggle')?.remove();
    };

    // Delay script execution slightly
    setTimeout(loadScripts, 100);
  }, []);

  // Avoid rendering until hydration is complete (prevents mismatch)
  if (!hydrated) return null;

  return (
    <div id="wrapper" className="flex flex-col min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}