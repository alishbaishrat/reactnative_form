import { supabase } from "../../utils/supabase";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [nameError, setNameError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // New state for password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // New state for confirm password visibility

  // ✅ Function to check password rules
  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(password);
  const allValid =
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.number &&
    passwordValidation.specialChar;

  // ✅ Name validation
  // const validateName = (text) => {
  //   setName(text);
  //   if (text.trim().length === 0) {
  //     setNameError("Name is required ❌");
  //   } else if (text.trim().length < 3) {
  //     setNameError("Name must be at least 3 characters ❌");
  //   } else if (!/^[A-Za-z\s]+$/.test(text)) {
  //     setNameError("Name can only contain alphabets ❌");
  //   } else {
  //     setNameError("");
  //   }
  // };
  
  const validateName = (text) => {
    setName(text);
    if (text.trim().length === 0) {
      setNameError("Name is required ❌");
    }
    else if (!/^[A-Za-z\s]+$/.test(text)) {
      setNameError("Name can only contain alphabets ❌");
    } else {
      setNameError("");
    }
  };

  // ✅ Email validation
  const validateEmail = (text) => {
    setEmail(text);
    if (text.length === 0) {
      return;
    }
    if (!text.endsWith("@gmail.com")) {
      alert("Enter a valid Email (e.g., @gmail.com)");
    }
  };

  // ✅ Handle Signup with duplicate email check
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields ❌");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    if (!allValid) {
      alert("Password does not meet the requirements ❌");
      return;
    }

    if (nameError || name.trim().length === 0) {
      alert("Please enter a valid name ❌");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("already registered") ||
          msg.includes("user already exists") ||
          msg.includes("exists")
        ) {
          alert("Email already exists ❌"); // ✅ Popup instead of inline error
        } else {
          alert("Signup failed: " + error.message);
        }
        return;
      }

      // ⚡ Detect if account already exists (Supabase quirk fix)
      if (!data.session && !data.user?.identities?.length) {
        alert("Email already exists ❌");
        return;
      }

      // ✅ Success
      if (!data.session) {
        alert("Account created 🎉 Please confirm your email before logging in.");
      } else {
        alert("Signup successful ✅ You are logged in.");
      }

      navigation.navigate("Login");
    } catch (err) {
      alert("Unexpected error: " + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="person-add-outline" size={70} color="#007AFF" />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us and get started</Text>

      {/* Name input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={validateName}
        />
      </View>
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      {/* Email input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={validateEmail}
        />
      </View>

      {/* Password input with eye icon */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#555"
          />
        </Pressable>
      </View>

      {(isPasswordFocused || password.length > 0) && (
        <View style={styles.validationContainer}>
          <Text style={passwordValidation.length ? styles.valid : styles.invalid}>
            {passwordValidation.length ? "✅" : "❌"} At least 8 characters
          </Text>
          <Text style={passwordValidation.uppercase ? styles.valid : styles.invalid}>
            {passwordValidation.uppercase ? "✅" : "❌"} At least 1 uppercase letter
          </Text>
          <Text style={passwordValidation.number ? styles.valid : styles.invalid}>
            {passwordValidation.number ? "✅" : "❌"} At least 1 number
          </Text>
          <Text style={passwordValidation.specialChar ? styles.valid : styles.invalid}>
            {passwordValidation.specialChar ? "✅" : "❌"} At least 1 special character
          </Text>
        </View>
      )}

      {/* Confirm Password input with eye icon */}
      <View style={styles.inputContainer}>
        <Ionicons name="checkmark-done-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <Ionicons
            name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#555"
          />
        </Pressable>
      </View>

      {/* Signup button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already have account */}
      <Text style={styles.text}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Login
        </Text>
      </Text>
          
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    width: "90%",
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  validationContainer: {
    width: "90%",
    marginBottom: 15,
  },
  valid: {
    color: "green",
    fontSize: 14,
  },
  invalid: {
    color: "red",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginTop: 20,
  },
  link: {
    color: "#0972d5ff",
    marginTop: 15,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginTop: -10,
    marginBottom: 5,
  },
  goToHomeButton: {
    marginTop: 100,
    backgroundColor: "#3b86f0ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: 200,
  },
  goToHomeButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
});