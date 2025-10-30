import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screen/HomeScreen';
import LoginScreen from './screen/LoginScreen';
import SignupScreen from './screen/SignupScreen';
import ContactScreen from './screen/ContactScreen';
import DashboardScreen from "./screen/DashboardScreen";
import SplashScreen from "../components/SplashScreen";

import { navigationRef } from "./navigationRef";
import ForgotPasswordScreen from "./screen/ForgotPasswordScreen";
import ResetPasswordScreen from "./screen/ResetPasswordScreen";
import ProfileScreen from "./screen/ProfileScreen";
import VideoScreen from "./screen/VideoScreen";
import FAQScreen from "./screen/FAQScreen";

import UpdateProfileScreen from "./screen/UpdateProfileScreen";
import InvoiceScreen from "./screen/InvoiceScreen";
import PaymentDetailsScreen from "./screen/PaymentDetailsScreen";
import SupportHelpScreen from "./screen/SupportHelpScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="DashboardMain"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 6 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'DashboardMain') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Contact') iconName = 'call';
          else if (route.name === 'Videos') iconName = 'videocam';
          else if (route.name === 'FAQs') iconName = 'help-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DashboardMain" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Videos" component={VideoScreen} options={{ title: "Videos" }}/>
      <Tab.Screen name="FAQs" component={FAQScreen} options={{ title: "FAQs" }}/>

    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown:false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown:false }} />
        <Stack.Screen name="Dashboard" component={DashboardTabs} options={{ headerShown:false }} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
        <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
        <Stack.Screen name="SupportHelp" component={SupportHelpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

