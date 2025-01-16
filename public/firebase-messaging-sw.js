importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyC4MmYRqdpl9Ew5aX4iW20h3NeMdhdd5P4",
    authDomain: "todo-app-92a7d.firebaseapp.com",
    projectId: "todo-app-92a7d",
    storageBucket: "todo-app-92a7d.firebasestorage.app",
    messagingSenderId: "664812526014",
    appId: "1:664812526014:web:9f5d890f383c2a6ee701ef"
  };

  firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});