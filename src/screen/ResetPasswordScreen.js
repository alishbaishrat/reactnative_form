// screens/ResetPasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleResetPassword = async () => {
    if (!password || !confirm) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in both fields ❌",
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match ❌",
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
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
        text2: "Password updated ✅ Please login again.",
      });

      // Navigate back to login after a short delay so user can see the toast
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        placeholder="Enter New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm New Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});

