// // HomeScreen.js
// import React from "react";
// import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

// const { width } = Dimensions.get("window");
// const LOGO_SIZE = Math.min(180, width * 0.45);

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity activeOpacity={0.9} onPress={() => {/* optional action */}}>
//         <Image
//           source={require("../assets/logo.png")}
//           style={styles.logo}
//           accessibilityLabel="App logo"
//         />
//       </TouchableOpacity>

//       <Text style={styles.title}>Welcome to MyApp</Text>
//       <Text style={styles.subtitle}>Your short tagline goes here</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#70afefff",
//     padding: 20,
//   },
//   logo: {
//     width: LOGO_SIZE,
//     height: LOGO_SIZE,
//     borderRadius: LOGO_SIZE * 0.18, // change to LOGO_SIZE/2 for full circle
//     marginBottom: 20,

//     // shadow (iOS)
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.18,
//     shadowRadius: 8,

//     // elevation (Android)
//     elevation: 8,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "#fff",
//   },
//   subtitle: {
//     color: "rgba(255,255,255,0.9)",
//     fontSize: 15,
//   },
// });


import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo's built-in icons

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Move to Home after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Login"); // Change "Home" to your actual next screen name
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* ✅ App Logo */}
      <Image
        source={require("../assets/favicon.png")} // 👈 path to your logo
        style={styles.logo}
      />

      {/* App Name or Text */}
      <Text style={styles.title}>Welcome to MyApp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#70afefff",
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 36, // change to 90 for full circle
    marginBottom: 40, 
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
});


