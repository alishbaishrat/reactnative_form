import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UpdateProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Update Profile</Text>
      <Text style={styles.text}>
        To update your profile, go to your Profile tab, edit your information,
        and press Save.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f6fc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, color: "#444" },
});
