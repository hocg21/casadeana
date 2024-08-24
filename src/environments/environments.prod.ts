import { FirebaseConfig } from "src/app/interfaces/firebase-config.interface";

const firebase: FirebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

export const environment = {
  production: true,
  firebase,
  baseUrl: 'http://casadeanaslw.com:3000'
};
