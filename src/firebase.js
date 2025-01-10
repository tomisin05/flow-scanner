// // Import the functions you need from the SDK s you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc } from 'firebase/firestore';


// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
 

// async function handleUpload(file) {
//     try {
//       const storageRef = ref(storage, `flows/${auth.currentUser.uid}/${file.name}`);
//       await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(storageRef);
  
//       // Save metadata to Firestore
//       await addDoc(collection(db, 'flows'), {
//         userId: auth.currentUser.uid,
//         fileName: file.name,
//         fileUrl: downloadURL,
//         uploadDate: new Date().toISOString(),
//         // ... other metadata
//       });
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   }

// //   flows structure

// lib/firebase/config.js
// lib/firebase/users.js 
// lib/firebase/flows.js
