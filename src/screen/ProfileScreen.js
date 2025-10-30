import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // to select image from gallery or take a new photo from camera
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select"; // dropdownpicker for selecting country codes
import { supabase } from "../../utils/supabase"; // connect frontend app to the supabase
import { TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateError, setDateError] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [imageError, setImageError] = useState("");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [user, setUser] = useState(null);

  // 👇 Fetch user info from Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  // 👇 Fetch existing profile if it exists
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile data:", error);
        return;
      }

      if (data) {
        setName(data.name || "");
        setContact(data.contact || "");
        setCountryCode(data.country_code || "");
        setDate(data.date_of_birth ? new Date(data.date_of_birth) : new Date());
        setImageUri(data.image_url || null);
      }
    };

    fetchProfileData();
  }, [user]);

  const toggleDatePicker = () => setShowPicker(!showPicker);

  const validateName = (text) => {
    setName(text);
    if (!text.trim()) setNameError("Name is required ❌");
    else if (!/^[A-Za-z\s]+$/.test(text))
      setNameError("Name can only contain alphabets ❌");
    else setNameError("");
  };

  const validateContact = (text) => {
    setContact(text);
    const onlyDigits = /^[0-9]+$/;
    if (!text.trim()) setContactError("Contact number is required ❌");
    else if (!onlyDigits.test(text))
      setContactError("Contact number can only contain digits ❌");
    else if (text.length < 10 || text.length > 13)
      setContactError("Contact number must be 10–13 digits ❌");
    else if (!countryCode)
      setContactError("Please select your country code ❌");
    else setContactError("");
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageError("");
      }
    } catch (err) {
      console.log("pickImage error:", err);
      setImageError("Could not pick the image.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required", "Camera permission is required to take a photo.");
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageError("");
      }
    } catch (err) {
      console.log("takePhoto error:", err);
      setImageError("Could not take the photo.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !contact || !countryCode || !date || !imageUri) {
      alert("Error", "❌ Please fill all required fields.");
      return;
    }
    if (nameError || contactError || dateError || imageError) {
      alert("Error", "❌ Please correct the highlighted errors before submitting.");
      return;
    }

    let uploadedImageUrl = null;
    if (imageUri) {
      const fileName = `profile_${Date.now()}.jpg`;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });
      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Error", "❌ Failed to upload image.");
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);
      uploadedImageUrl = publicUrlData.publicUrl;
    }

    const profileData = {
      name,
      email: user?.email,
      date_of_birth: date.toISOString().split("T")[0],
      contact,
      country_code: countryCode,
      image_url: uploadedImageUrl || imageUri,
    };

    try {
      // ✅ Check if user already exists
      const { data: existingProfile, error: selectError } = await supabase
        .from("profile")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (selectError) {
        console.error("Select error:", selectError);
        alert("Error", "❌ Failed to check existing profile.");
        return;
      }

      if (existingProfile) {
        // ✅ Update existing record
        const { error: updateError } = await supabase
          .from("profile")
          .update(profileData)
          .eq("email", user.email);

        if (updateError) {
          console.error("Update error:", updateError);
          alert("Error", "❌ Failed to update profile.");
        } else {
          alert("Success", "✅ Profile updated successfully!");
        }
      } else {
        // ✅ Insert new record
        const { error: insertError } = await supabase
          .from("profile")
          .insert(profileData);

        if (insertError) {
          console.error("Insert error:", insertError);
          alert("Error", "❌ Failed to create profile.");
        } else {
          Alert.alert("Success", "✅ Profile created successfully!");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Error", "❌ Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit your profile</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Pressable onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle-outline" size={64} color="#666" />
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.avatarButtonsRow}>
        <Pressable style={styles.smallBtn} onPress={pickImage}>
          <Text style={styles.smallBtnText}>Choose Photo</Text>
        </Pressable>
        <Pressable style={styles.smallBtn} onPress={takePhoto}>
          <Text style={styles.smallBtnText}>Take Photo</Text>
        </Pressable>
        {imageUri && (
          <Pressable
            style={[styles.smallBtn, { backgroundColor: "#fff", borderWidth: 1 }]}
            onPress={() => setImageUri(null)}
          >
            <Text style={[styles.smallBtnText, { color: "#333" }]}>Remove</Text>
          </Pressable>
        )}
      </View>

      {/* Name Field */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Name:</Text>
        <View style={styles.fieldContainer}>
          <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={validateName}
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      {/* Email Field */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Email:</Text>
        <View style={styles.fieldContainer}>
          <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={user?.email || ""}
            editable={false}
          />
        </View>
      </View>

      {/* Date of Birth */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Date of Birth:</Text>
        <Pressable onPress={toggleDatePicker}>
          <View style={styles.fieldContainer}>
            <Ionicons name="calendar-outline" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={[styles.input, { color: "#333", opacity: 1 }]}
              placeholder="Select Date of Birth"
              value={
                date
                  ? `${date.getDate().toString().padStart(2, "0")}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`
                  : "[dd-mm-yyyy]"
              }
              editable={false}
              pointerEvents="none"
            />
          </View>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            value={date}
            onChange={(event, selectedDate) => {
              if (selectedDate && selectedDate <= new Date()) {
                setDate(selectedDate);
                setDateError("");
                setShowPicker(false);
              } else {
                setDateError("Date of Birth cannot be in the future ❌");
              }
            }}
            maximumDate={new Date()}
          />
        )}
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
      </View>

      {/* Contact */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Contact:</Text>
        <View style={styles.contactRow}>
          <View style={styles.countryPicker}>
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
                inputIOS: { fontSize: 14, padding: 4, textAlign: "center" },
                inputAndroid: { fontSize: 14, padding: 4, textAlign: "center" },
                inputWeb: { fontSize: 14, padding: 8, textAlign: "center" },
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                backgroundColor: "#f0f0f0",
                fontSize: 16,
                color: "#333",
              }}
              placeholder="Contact Number"
              value={contact}
              onChangeText={validateContact}
              keyboardType="phone-pad"
            />
            {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
          </View>
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "8%",
    paddingHorizontal: "6%",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 20 },
  fieldWrapper: { width: "100%", maxWidth: 350, marginBottom: 10 },
  label: { fontSize: 14, color: "#333", marginBottom: 4, fontWeight: "500" },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#333" },
  errorText: { color: "red", marginTop: 4, fontSize: 14 },
  avatarContainer: { alignItems: "center", marginBottom: 15 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    margin: 4,
  },
  smallBtnText: { color: "#fff", fontSize: 14 },
  contactRow: { flexDirection: "row", alignItems: "center", width: "100%" },
  countryPicker: {
    flex: 0.5,
    width: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 1,
    backgroundColor: "#f9f9f9",
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    maxWidth: 150,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
