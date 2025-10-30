// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import { supabase } from "../../utils/supabase";

// export default function ForgotPasswordScreen({ navigation }) {
//   const [email, setEmail] = useState("");

//   const handleSendLink = async () => {
//     if (!email) return Alert.alert("Enter your email");

//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: "myapp://reset-password", // custom deep link
//     });

//     if (error) {
//       Alert.alert("Error", error.message);
//     } else {
//       Alert.alert("Success", "Check your email for reset link.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forgot Password</Text>
//       <TextInput
//         placeholder="Enter Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSendLink}>
//         <Text style={styles.buttonText}>Send Reset Link</Text>
//       </TouchableOpacity>

//       <View style={styles.linkContainer}>
//         <Text style={styles.text}>
//           Back to?{" "}
//           <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
//              Login
//           </Text>
//         </Text>
//       </View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
//   input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
//   button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, alignItems: "center" },
//   buttonText: { color: "#fff", fontWeight: "600" },
//   linkContainer: { justifyContent: "center", marginTop: 16, alignItems: "center" },
//   text: { fontSize: 14, color: "#007AFF" }, 
//   link: { fontSize: 14, color: "#007AFF", textDecorationLine: "underline", fontWeight: "600" },
// });

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendLink = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Enter your email ❌",
      });
      return;
    }

    const redirectUrl = Linking.createURL("reset-passwords");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl, // custom deep link
    });

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Check your email for reset link ✅",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendLink}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.text}>
          Back to?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  linkContainer: { justifyContent: "center", marginTop: 16, alignItems: "center" },
  text: { fontSize: 14, color: "#007AFF" },
  link: { fontSize: 14, color: "#007AFF", textDecorationLine: "underline", fontWeight: "600" },
});


