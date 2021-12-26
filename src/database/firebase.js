import firebase from "firebase";
// import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDIDz4m6WOFfcZxsEfkhwbFCZI2nezCJNA",
    authDomain: "test-a8175.firebaseapp.com",
    projectId: "test-a8175",
    storageBucket: "test-a8175.appspot.com",
    messagingSenderId: "834404364372",
    appId: "1:834404364372:web:b09b5faf3647b6817f3dc1",
    measurementId: "G-B6HX8YY26T",
};
// const db = getDatabase();

const fb = firebase.initializeApp(firebaseConfig);

export default fb;
