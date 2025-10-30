// // screens/VerifyOtpScreen.js
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { supabase } from "../../utils/supabase";

// export default function VerifyOtpScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const email = route.params?.email || "";
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleVerify = async () => {
//     if (!otp.trim()) return Alert.alert("Enter the code you received by email.");
//     setLoading(true);
//     try {
//       // Verify the OTP for password recovery
//       const { data, error } = await supabase.auth.verifyOtp({
//         email,
//         token: otp.trim(),
//         type: "recovery",
//       });

//       if (error) {
//         Alert.alert("Verification failed", error.message || "Invalid code");
//       } else {
//         // verification returned a session — user is now authenticated
//         Alert.alert("Verified", "You can now set a new password.");
//         // go to ResetPassword screen (user is signed in so updateUser will work)
//         navigation.navigate("ResetPassword");
//       }
//     } catch (err) {
//       Alert.alert("Unexpected error", err.message || String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Enter OTP</Text>
//       <Text style={styles.subtitle}>We sent a code to {email}</Text>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter OTP"
//           keyboardType="numeric"
//           value={otp}
//           onChangeText={setOtp}
//         />
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
//       </TouchableOpacity>

//       <TouchableOpacity style={{ marginTop:12 }} onPress={() => navigation.goBack()}>
//         <Text style={{ color:'#007AFF' }}>Back</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#f0f4f8' },
//   title:{ fontSize:22, fontWeight:'700', marginBottom:8, textAlign:'center' },
//   subtitle:{ textAlign:'center', color:'#666', marginBottom:20 },
//   inputContainer:{ backgroundColor:'#fff', paddingHorizontal:12, paddingVertical:10, borderRadius:10, marginBottom:12 },
//   input:{ fontSize:16 },
//   button:{ backgroundColor:'#007AFF', padding:14, borderRadius:10, alignItems:'center' },
//   buttonText:{ color:'#fff', fontWeight:'600' }
// });

