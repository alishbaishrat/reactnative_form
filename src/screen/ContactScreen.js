import React, { useState } from 'react';
import { View, TextInput, Button, Text, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../../utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import RNPickerSelect from "react-native-picker-select";

export default function ContactScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [countryCode, setCountryCode] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const validateName = (text) => {
    setName(text);
    if (text.trim().length < 3 || text.trim().length > 100) {
      setNameError("Name must be at least 3 characters ❌");
    } else if (!/^[A-Za-z\s]+$/.test(text)) {
      setNameError("Name can only contain alphabets ❌");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (text) => {
    setEmail(text);
    if (!text.endsWith("@gmail.com")) {
      setEmailError("Email should end with (e.g., @gmail.com)");
    } else {
      setEmailError("");
    }
  };

  const validateContact = (text) => {
    setContact(text);
    const phoneRegex = /^[0-9]{10,13}$/; // allows 10 to 13 digits
    if (!phoneRegex.test(text)) {
      setContactError("Contact number must be 10–13 digits");
    } else {
      setContactError("");
    }
    setTimeout(() => {
        setFeedback({ type: '', text: '' });
      }, 3000);
  };

  const handleSubmit = async () => {
    if (!name || !email || !message || !contact || !countryCode) {
      setFeedback({ type: 'error', text: '❌ Enter complete details' });

      setTimeout(() => {
        setFeedback({ type: '', text: '' });
      }, 3000);
      return;
    }
    if (nameError || emailError || contactError) {
      setFeedback({ type: 'error', text: '❌ Please fix errors before sending' });
      return;
    }

    try {
      // ✅ Insert into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, country_code: countryCode, contact, message }]);

      if (error) {
        console.error(error);
        setFeedback({ type: 'error', text: '❌ Failed to send message' });
      } else {
        setFeedback({ type: 'success', text: '✅ Your message was sent successfully' });
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setFeedback({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: '❌ Something went wrong' });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center',backgroundColor: '#f3f6fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Contact Us
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={18} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          underlineColorAndroid="transparent"
          selectionColor="#f2f4f7ff"
          onChangeText={validateName}
          />
      </View>
            
      {nameError ? <Text style={{ color: 'red'}}>{nameError}</Text> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={18} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={validateEmail}
          />
      </View>
            
      {emailError ? <Text style={{ color: 'red'}}>{emailError}</Text> : null}
      
      {/* Contact Number with Country Code */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ flex: 0.35, marginRight: 8 }}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setCountryCode(value)}
            value={countryCode}
            placeholder={{ label: "Code", value: null }}
            items={[
              { label: "🇵🇰 +92", value: "+92" },
              { label: "🇮🇳 +91", value: "+91" },
              { label: "🇺🇸 +1", value: "+1" },
              { label: "🇬🇧 +44", value: "+44" },
              { label: "🇨🇦 +1", value: "+1" },
            ]}
            style={{
              inputIOS: {
                fontSize: 16,
              paddingVertical: 12,
              paddingHorizontal: 10,
              color: "#000",
              backgroundColor: "#f9f4f4ff",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              paddingRight: 30, // space for the arrow
              },
              inputAndroid: {
                fontSize: 16,
                paddingVertical: 10,
                paddingHorizontal: 8,
                color: "#000",
              },
              placeholder: {
                color: "#999",
              },
            }}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      </View>

     <View style={{ flex: 0.9 }}>
      <TextInput
      style={[styles.input, {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f9f4f4ff'
      }]}
      placeholder="Contact Number"
      value={contact}
      onChangeText={validateContact}
      keyboardType="phone-pad"
    />
  </View>
</View>

      <View style={[styles.inputContainer, { height: 120, alignItems: "flex-start" }]}>
        <Ionicons name="chatbubbles-outline" size={18} color="#555" style={{ marginTop: 10 }} />
        <TextInput
           style={[styles.input, { height: "100%" }]}
           placeholder="Write your message..."
           value={message}
           onChangeText={setMessage}
           multiline
        />
      </View>

      <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Send</Text>
      </TouchableOpacity>

      {feedback.text ? (
        <Text
          style={{
            marginTop: 15,
            fontWeight: 'bold',
            color: feedback.type === 'error' ? 'red' : 'green',
          }}
        >
          {feedback.text}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f4f4ff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f4f4ff',
    justifyContent: "center",
  },  

  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  Button: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});


