// src/screens/FAQsScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function FAQsScreen({ navigation }) {
  const faqs = [
    { id: 1, question: "How do I update my profile?", screen: "UpdateProfile" },
    { id: 2, question: "Invoice number", screen: "Invoice" },
    { id: 3, question: "Payment Details", screen: "PaymentDetails" },
    { id: 4, question: "How do I contact support?", screen: "SupportHelp" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>FAQs</Text>

        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqButton}
            onPress={() => navigation.navigate(faq.screen)} // ✅ navigate to screen
          >
            <Text style={styles.faqText}>{faq.question}</Text>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc", // ✅ same as dashboard
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",  
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  faqButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
