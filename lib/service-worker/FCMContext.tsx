import { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/messaging';
import { RequestHelper } from '../request-helper';
import { firebaseConfig } from '../firebase-client';

interface FCMContextState {
  fcmSw: ServiceWorkerRegistration;
  messageToken: string;
  resetToken: () => Promise<void>;
  messagingObj: firebase.messaging.Messaging;
}

const FCMContext = createContext<FCMContextState | undefined>(undefined);

function useFCMContext(): FCMContextState {
  const context = useContext(FCMContext);
  if (!context) throw new Error('useSWContext must be used in a provider');
  return context;
}

function FCMProvider({ children }: React.PropsWithChildren<Record<string, any>>): JSX.Element {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration>();
  const [messageToken, setMessageToken] = useState<string>();
  const [messagingObj, setMessagingObj] = useState<firebase.messaging.Messaging>();

  useEffect(() => {
    if ('serviceWorker' in window.navigator) {
      const swParamString = new URLSearchParams({
        ...firebaseConfig,
        iconUrl: process.env.NEXT_PUBLIC_ICON_URL,
      }).toString();

      window.navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParamString}`).then(
        async (registration) => {
          setSwRegistration(registration);
          if (firebase.apps.length <= 0) firebase.initializeApp(firebaseConfig);

          const messaging = firebase.messaging();
          if (Notification.permission === 'default') await Notification.requestPermission();

          if (Notification.permission === 'granted') {
            let token = await messaging.getToken({
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
            });

            const { data } = await RequestHelper.post<unknown, any>(
              'https://fcm.googleapis.com/fcm/send',
              {
                headers: {
                  Authorization: `key=${process.env.NEXT_PUBLIC_CLOUD_MESSAGING_SERVER_TOKEN}`,
                  'Content-Type': 'application/json',
                },
              },
              {
                to: token,
                data: {
                  notification: {
                    announcement: 'Here goes another one',
                    time: 'test data goes here',
                  },
                },
                dry_run: true,
              },
            );

            if (data.results[0].error) {
              await messaging.deleteToken();
              token = await messaging.getToken({
                vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
              });
            }

            await RequestHelper.post<{ token: string }, void>(
              '/api/tokens',
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
              {
                token,
              },
            );
            setMessageToken(token);
            messaging.onMessage((payload) => {
              const { announcement, baseUrl: url } = JSON.parse(payload.data.notification);
              const options = {
                body: announcement,
                icon: 'icons/icon-128x128.png',
                tag: new Date().toUTCString(),
                data: { url },
              };
              registration.showNotification('HackPortal Announcement', options);
            });
          }
          console.log('Service Worker registration successfully');
        },
        function (err) {
          console.log('Service Worker registration failed');
        },
      );
    }
  }, []);

  const resetToken = async () => {
    await messagingObj.deleteToken();
    const newToken = await messagingObj.getToken({ vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
    setMessageToken(newToken);
  };

  const swContextValue: FCMContextState = {
    fcmSw: swRegistration,
    messageToken,
    resetToken,
    messagingObj,
  };

  return <FCMContext.Provider value={swContextValue}>{children}</FCMContext.Provider>;
}

export { FCMContext, FCMProvider, useFCMContext };
