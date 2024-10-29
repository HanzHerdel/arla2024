import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

export const firebaseConfig = {
    apiKey:"AIzaSyAC7fpUX3rEdJXha3bqtOh_1wYxxmtlK2c",
    authDomain: "arla-8da78.firebaseapp.com",
    projectId: "arla-8da78",
    databaseURL: "https://arla-8da78.firebaseio.com",
    storageBucket: "arla-8da78.appspot.com",
    messagingSenderId: '956633143114',
    timestampsInSnapshots:true
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app); 

export default app;
