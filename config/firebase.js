const firebase = require("firebase");
require("firebase/firestore");

require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER,
    appId: process.env.APP_ID
};

firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

module.exports = { database }