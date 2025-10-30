// src/screen/Chatbot.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../utils/supabase";
import { useFocusEffect } from "@react-navigation/native";

// 🧠 Static chatbot rules
const chatbotRules = [
  {
    keywords: ["hi", "hello", "hey"],
    response: "Hi, How are you?",
    suggestions: ["Fine", "What can you do?", "Tell me about yourself", "I need help"],
  },
  {
    keywords: ["how are you", "how's it going"],
    response: "It's going well, thank you! How can I assist you?",
    suggestions: ["What can you do?", "Who developed you?", "Tell me more"],
  },
  {
    keywords: ["fine", "okay", "well"],
    response: "I’m glad to hear that. How can I assist you further?",
    suggestions: ["Tell me your purpose", "Who developed you?", "No help needed"],
  },
  {
    keywords: ["your purpose", "your goal", "why are you made"],
    response: "My purpose is to assist users by responding to queries and offering relevant suggestions.",
    suggestions: ["That’s great", "Who made you?", "Thank you"],
  },
  {
    keywords: ["what can you do", "tell me about yourself", "who made you", "who developed you"],
    response: "I was created by a developer for demonstration and learning purposes.",
    suggestions: ["Nice", "Tell me about your features"],
  },
  {
    keywords: ["how do you do", "nice", "tell me about your features", "tell me more"],
    response: "I’m functioning smoothly, thank you for asking. How are you today?",
    suggestions: ["What can you do?", "Who developed you?"],
  },
  {
    keywords: ["developer", "created you"],
    response: "I was created by a developer for demonstration and learning purposes.",
    suggestions: ["Nice", "Tell me about your features", "Help"],
  },
  {
    keywords: ["help", "commands", "what can you do"],
    response: "I can chat with you and answer basic questions.",
    suggestions: ["Who are you?", "Bye"],
  },
  {
    keywords: ["who are you"],
    response: "I’m your friendly static chatbot 🤖 — built using React Native!",
    suggestions: ["Help", "Bye"],
  },
  {
    keywords: ["thank you", "thanks", "appreciate"],
    response: "You're welcome! It’s my pleasure to assist you.",
    suggestions: ["Bye", "Continue chat", "End session"],
  },
  {
    keywords: ["bye", "goodbye"],
    response: "👋 Goodbye! Have a nice day!",
    suggestions: [],
  },
  {
    keywords: [],
    response: "Sorry, I didn’t understand. Try saying 'help' for options.",
    suggestions: ["Help", "Who are you?"],
  },
];

export default function Chatbot({ user, navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hi! 👋 How can I help you?",
      suggestions: ["Hi", "Help", "Who are you?"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load chat messages from Supabase
  const loadMessages = async () => {
    if (!user?.email) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: true });

    setLoading(false);

    if (error) {
      console.error("❌ Error loading chat history:", error.message);
      return;
    }

    if (data && data.length > 0) {
      const formatted = data.flatMap((m) => [
        { id: m.id * 2 - 1, from: "user", text: m.question },
        { id: m.id * 2, from: "bot", text: m.response },
      ]);

      setMessages([
        {
          id: 1,
          from: "bot",
          text: "Hi! 👋 How can I help you?",
          suggestions: ["Hi", "Help", "Who are you?"],
        },
        ...formatted,
      ]);
    }
  };

  // 🔄 Reload messages whenever Chatbot screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [user])
  );

  // 📨 Handle sending a message
  const handleSend = async (textParam) => {
    const userText = textParam || input.trim();
    if (!userText) return;

    const newUserMessage = { id: Date.now(), from: "user", text: userText };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Find chatbot response
    const rule =
      chatbotRules.find((r) =>
        r.keywords.some((word) => userText.toLowerCase().includes(word.toLowerCase()))
      ) || chatbotRules[chatbotRules.length - 1];

    const botResponse = {
      id: Date.now() + 1,
      from: "bot",
      text: rule.response,
      suggestions: rule.suggestions || [],
    };

    // 🔸 Save to Supabase using correct column (email)
    if (user?.email) {
      const { error } = await supabase.from("chat_history").insert([
        {
          email: user.email,
          question: userText,
          response: rule.response,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("❌ Supabase insert error:", error.message);
      } else {
        console.log("✅ Chat saved successfully for:", user.email);
      }
    } else {
      console.warn("⚠️ No user email found — chat not saved.");
    }

    // navigation logic based on keywords
    if (userText.toLowerCase().includes("profile")) {
      navigation.navigate("UpdateProfile");
    } else if (userText.toLowerCase().includes("invoice")) {
      navigation.navigate("Invoice");
    } else if (userText.toLowerCase().includes("payment")) {
      navigation.navigate("PaymentDetails");
    } else if (userText.toLowerCase().includes("contact support")) {
      navigation.navigate("SupportHelp");
    }

    // Simulate bot reply delay
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  // 💬 Render each message
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.from === "user" ? styles.userMsg : styles.botMsg,
      ]}
    >
      <Text style={styles.msgText}>{item.text}</Text>

      {item.suggestions && item.suggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          {item.suggestions.map((suggestion, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionBtn}
              onPress={() => handleSend(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // 🖥 Render full chat interface
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  message: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  botMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },
  msgText: { color: "#000" },
  suggestionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  suggestionBtn: {
    backgroundColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  suggestionText: {
    color: "#333",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 20,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
