const { getDefaultConfig } = require("expo/metro-config"); // if using Expo
// const { getDefaultConfig } = require("metro-config"); // if pure React Native

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("lottie");

module.exports = config;
