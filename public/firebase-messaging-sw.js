importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js');

// TODO: Abstract this into environment variable


function setup() {
    firebase.initializeApp({
      apiKey: "AIzaSyBtW-4cwMOMyhP8x1e8mxtaZCM-HjUTa8o",
      authDomain: "comethackportal.firebaseapp.com",
      projectId: "comethackportal",
      storageBucket: "comethackportal.appspot.com",
      messagingSenderId: "529336569590",
      appId: "1:529336569590:web:fa233d5caf3900e41866d7",
      measurementId: "G-6WDSC83CQ9"
    });
    
  const messaging = firebase.messaging();

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    clients.openWindow(event.notification.data.url);
  })

  messaging.onBackgroundMessage(function (payload) {
    const { announcement, baseUrl: url } = JSON.parse(payload.data.notification);
    var options = {
      body: announcement,
      icon: 'https://raw.githubusercontent.com/acmutd/hackportal/develop/public/icons/icon-128x128.png',
      data: { url }
    };
    self.registration.showNotification("HackPortal Announcement", options);
  });
}

setup();


//background notifications will be received here

