import { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';  
import '../styles/globals.css';
import '/public/assets/css/noscript.css';
import {auth, firestore} from "@/firebase-config";
import {createUserProfile} from "@/pages/api/user-management";
import {doc, getDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

export default function App({ Component, pageProps }) {


  useEffect(() => {


      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
              // Check if user exists in database, if not create profile
              const userDoc = await getDoc(doc(
                  firestore, 'users', user.uid));
              if (!userDoc.exists()) {
                  await createUserProfile(user);
              }
          }
      });

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


