import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo's built-in icons

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* App Title */}
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
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
});

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const App = () => {
//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#4c669f', '#3b5998', '#192f6a']} // Array of colors for the gradient
//         style={styles.gradient}
//         start={{ x: 0, y: 0 }} // Start point of the gradient (top-left)
//         end={{ x: 1, y: 1 }}   // End point of the gradient (bottom-right)
//       >
//         <Text style={styles.text}>Gradient Background</Text>
//       </LinearGradient>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1, // Make the gradient fill the entire container
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default App;