// // // App.js
// // import "react-native-get-random-values";
// // import "react-native-url-polyfill/auto";
// // import React, { useEffect, useState } from "react";   // ✅ import useState here
// // import { Linking } from "react-native";
// // import { supabase } from "./utils/supabase";
// // import Navigation from "./src/Navigation";
// // import { navigationRef } from "./src/navigationRef";
// // import SplashScreen from "./components/SplashScreen";
// // import Toast from "react-native-toast-message";

// // function parseHashParams(url) {
// //   const idx = url.indexOf("#");
// //   const hash = idx >= 0 ? url.substring(idx + 1) : "";
// //   if (!hash) return {};
// //   return hash.split("&").reduce((acc, pair) => {
// //     const [k, v] = pair.split("=");
// //     if (k) acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
// //     return acc;
// //   }, {});
// // }

// // export default function App() {
// //   // ✅ state must be here, not inside useEffect
// //   const [animationCompleted, setAnimationCompleted] = useState(false);

// //   useEffect(() => {
// //     const handleUrl = async ({ url }) => {
// //       try {
// //         console.log("Deep link received:", url);
// //         const params = parseHashParams(url || "");
// //         console.log("Parsed hash params:", params);

// //         if (params.access_token && params.refresh_token) {
// //           const { data, error } = await supabase.auth.setSession({
// //             access_token: params.access_token,
// //             refresh_token: params.refresh_token,
// //           });

// //           if (error) {
// //             console.error("supabase.setSession error:", error.message);
// //           } else {
// //             console.log("Supabase session set", data);
// //           }

// //           if (navigationRef.isReady()) {
// //             if (params.type === "recovery") {
// //               navigationRef.navigate("ResetPassword");
// //             } else if (params.type === "signup") {
// //               navigationRef.navigate("Login");
// //             } else {
// //               navigationRef.navigate("Login");
// //             }
// //           }
// //           return;
// //         }
// //       } catch (err) {
// //         console.error("Deep link handling failed:", err);
// //       }
// //     };

// //     const subscription = Linking.addEventListener("url", handleUrl);

// //     (async () => {
// //       const initialUrl = await Linking.getInitialURL();
// //       if (initialUrl) {
// //         console.log("Initial URL:", initialUrl);
// //         handleUrl({ url: initialUrl });
// //       }
// //     })();

// //     return () => {
// //       subscription.remove();
// //     };
// //   }, []);

// //   // ✅ Show splash first, then switch to Navigation
// //   if (!animationCompleted) {
// //     return <SplashScreen onFinish={() => setAnimationCompleted(true)} />;
// //   }

// //   return (
// //     <>
// //       <Navigation />
// //       <Toast />
// //     </>
// //   );
// // }

// // App.js
// // App.js
// import "react-native-get-random-values";
// import "react-native-url-polyfill/auto";
// import React, { useEffect, useState } from "react";
// import { Linking as RNLinking } from "react-native"; // React Native's Linking
// import * as ExpoLinking from "expo-linking";          // Expo Linking
// import { supabase } from "./utils/supabase";
// import Navigation from "./src/Navigation";
// import { navigationRef } from "./src/navigationRef";
// import SplashScreen from "./components/SplashScreen";
// import Toast from "react-native-toast-message";

// // Parse hash params from Supabase redirect (access_token, refresh_token, type)
// function parseHashParams(url) {
//   const idx = url.indexOf("#");
//   const hash = idx >= 0 ? url.substring(idx + 1) : "";
//   if (!hash) return {};
//   return hash.split("&").reduce((acc, pair) => {
//     const [k, v] = pair.split("=");
//     if (k) acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
//     return acc;
//   }, {});
// }

// export default function App() {
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     // Handle deep links
//     const handleUrl = async ({ url }) => {
//       try {
//         console.log("Deep link received:", url);

//         // Parse using Expo Linking
//         const { path, queryParams } = ExpoLinking.parse(url);
//         console.log("Parsed path:", path);
//         console.log("Parsed queryParams:", queryParams);

//         // Fallback to hash params (for Supabase reset links)
//         const params = Object.keys(queryParams).length
//           ? queryParams
//           : parseHashParams(url || "");

//         if (params.access_token && params.refresh_token) {
//           const { data, error } = await supabase.auth.setSession({
//             access_token: params.access_token,
//             refresh_token: params.refresh_token,
//           });

//           if (error) console.error("supabase.setSession error:", error.message);
//           else console.log("Supabase session set", data);

//           if (navigationRef.isReady()) {
//             if (params.type === "recovery") {
//               navigationRef.navigate("ResetPassword");
//             } else if (params.type === "signup") {
//               navigationRef.navigate("Login");
//             } else {
//               navigationRef.navigate("Login");
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Deep link handling failed:", err);
//       }
//     };

//     // Subscribe to URL events
//     const subscription = RNLinking.addEventListener("url", handleUrl);

//     // Handle app opened with a link
//     (async () => {
//       const initialUrl = await RNLinking.getInitialURL();
//       if (initialUrl) {
//         console.log("Initial URL:", initialUrl);
//         handleUrl({ url: initialUrl });
//       }
//     })();

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   // Fallback splash timeout
//   useEffect(() => {
//     const MAX_SPLASH_MS = 5000;
//     const t = setTimeout(() => setShowSplash(false), MAX_SPLASH_MS);
//     return () => clearTimeout(t);
//   }, []);

//   if (showSplash) {
//     return <SplashScreen onFinish={() => setShowSplash(false)} />;
//   }

//   return (
//     <>
//       <Navigation />
//       <Toast />
//     </>
//   );
// }

// App.js
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import React, { useEffect } from "react";
import { Linking as RNLinking } from "react-native"; // React Native's Linking
import * as ExpoLinking from "expo-linking";          // Expo Linking
import { supabase } from "./utils/supabase";
import Navigation from "./src/Navigation";
import { navigationRef } from "./src/navigationRef";
import Toast from "react-native-toast-message";

// Parse hash params from Supabase redirect (access_token, refresh_token, type)
function parseHashParams(url) {
  const idx = url.indexOf("#");
  const hash = idx >= 0 ? url.substring(idx + 1) : "";
  if (!hash) return {};
  return hash.split("&").reduce((acc, pair) => {
    const [k, v] = pair.split("=");
    if (k) acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
    return acc;
  }, {});
}

export default function App() {
  useEffect(() => {
    // Handle deep links
    const handleUrl = async ({ url }) => {
      try {
        console.log("Deep link received:", url);

        // Parse using Expo Linking
        const { path, queryParams } = ExpoLinking.parse(url);
        console.log("Parsed path:", path);
        console.log("Parsed queryParams:", queryParams);

        // Fallback to hash params (for Supabase reset links)
        const params = Object.keys(queryParams).length
          ? queryParams
          : parseHashParams(url || "");

        if (params.access_token && params.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) console.error("supabase.setSession error:", error.message);
          else console.log("Supabase session set", data);

          if (navigationRef.isReady()) {
            if (params.type === "recovery") {
              navigationRef.navigate("ResetPassword");
            } else if (params.type === "signup") {
              navigationRef.navigate("Login");
            } else {
              navigationRef.navigate("Login");
            }
          }
        }
      } catch (err) {
        console.error("Deep link handling failed:", err);
      }
    };

    // Subscribe to URL events
    const subscription = RNLinking.addEventListener("url", handleUrl);

    // Handle app opened with a link
    (async () => {
      const initialUrl = await RNLinking.getInitialURL();
      if (initialUrl) {
        console.log("Initial URL:", initialUrl);
        handleUrl({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <Navigation />
      <Toast />
    </>
  );
}
