import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAfWYiPKHmPLf4CHhhg_idbPSIN_POGfmY",
    authDomain: "hrdc-intranet.firebaseapp.com",
    projectId: "hrdc-intranet",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);