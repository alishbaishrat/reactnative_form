// src/screens/DashboardScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../utils/supabase";
import Chatbot from "./Chatbot";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.log("❌ Supabase error:", error.message);
        } else if (data?.user) {
          console.log("✅ User loaded:", data.user);
          setUser(data.user);
        } else {
          console.log("⚠️ No user found (maybe logged out)");
        }
      } catch (err) {
        console.log("⚠️ Exception while getting user:", err.message);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate("Login");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Dashboard</Text>
      </View>

      {/* Middle */}
      <View style={styles.middle}>
        {user ? (
          <Text style={styles.text}>Welcome, {user.email}</Text>
        ) : (
          <Text style={styles.text}>No user logged in</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonA} onPress={handleLogout}>
          <Text style={styles.buttonTextA}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 💬 Floating Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setChatVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 💬 Chat Modal */}
      <Modal
        visible={chatVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.chatBox}>
            {/* ✅ Pass user safely */}
            <Chatbot user={user} navigation = {navigation} />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setChatVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  middle: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 30,
    paddingRight: 30,
  },
  buttonA: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonTextA: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  chatBox: {
    height: "60%",
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 5,
  },
});
