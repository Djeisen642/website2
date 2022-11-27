// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getPerformance } from '@firebase/performance';
import { onCLS, onFID, onLCP } from 'web-vitals';
import { ReportCallback } from 'web-vitals/src/types/base';
import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: runtimeConfig.GOOGLE_FIREBASE_API_KEY,
    authDomain: runtimeConfig.GOOGLE_FIREBASE_AUTH_DOMAIN,
    projectId: runtimeConfig.GOOGLE_FIREBASE_PROJECT_ID,
    storageBucket: runtimeConfig.GOOGLE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: runtimeConfig.GOOGLE_FIREBASE_MESSAGING_ID,
    appId: runtimeConfig.GOOGLE_FIREBASE_APP_ID,
    measurementId: runtimeConfig.GOOGLE_FIREBASE_MESSAGING_ID,
  };
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  getPerformance(app);

  const sendToGoogleAnalytics: ReportCallback = ({ name, delta, id }) => {
    // Assumes the global `gtag()` function exists, see:
    // https://developers.google.com/analytics/devguides/collection/gtagjs
    // https://firebase.google.com/docs/analytics/events?platform=web#log_events_5
    logEvent(analytics, name, {
      event_category: 'Web Vitals',
      // The `id` value will be unique to the current page load. When sending
      // multiple values from the same page (e.g. for CLS), Google Analytics can
      // compute a total by grouping on this ID (note: requires `eventLabel` to
      // be a dimension in your report).
      event_label: id,
      // Google Analytics metrics must be integers, so the value is rounded.
      // For CLS the value is first multiplied by 1000 for greater precision
      // (note: increase the multiplier for greater precision if needed).
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      // Use a non-interaction event to avoid affecting bounce rate.
      non_interaction: true,

      // OPTIONAL: any additional attribution params here.
      // See: https://web.dev/debug-performance-in-the-field/
      // dimension1: '...',
      // dimension2: '...',
      // ...
    });
  };

  onCLS(sendToGoogleAnalytics);
  onFID(sendToGoogleAnalytics);
  onLCP(sendToGoogleAnalytics);
});
