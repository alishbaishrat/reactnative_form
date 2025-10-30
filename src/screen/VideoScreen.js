// src/screen/VideoScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";

const { width, height: screenHeight } = Dimensions.get("window");

function extractVideoId(input) {
  if (!input) return null;
  const embedMatch = input.match(/\/embed\/([a-zA-Z0-9_-]{5,})/);
  if (embedMatch) return embedMatch[1];
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{5,})/);
  if (shortMatch) return shortMatch[1];
  const watchMatch = input.match(/v=([a-zA-Z0-9_-]{5,})/);
  if (watchMatch) return watchMatch[1];
  return input;
}

export default function VideoScreen() {
  const videos = [
    "https://youtu.be/z1qG80Jkzi8?si=vFS9XI1pGXNyIvTW",
    "https://youtu.be/3LVwTukzFu8?si=ENlNquz7eSJ7rLRf",
    "https://youtu.be/TQnThietOgk?si=dml8nKDegjDJz7uT",
    "https://youtu.be/wnuK2fR4mdA?si=ahHmru_hwYG1Db3N",
    "https://youtu.be/wnuK2fR4mdA?si=MXj8HEOUBkWGnM-Y",
    "https://youtu.be/aYZpxT9eHHg?si=6dd17DYDBhtizo-Y",
    "https://youtu.be/dCvZ2U_C5fk?si=1s6EI7jPuvy8GUuU",
    "https://youtu.be/-9bJaTHnE64?si=rFNdMv8ZeCRrRlYB",
  ];

  const [currentVideoInput, setCurrentVideoInput] = useState(videos[0]);
  const currentVideoId = extractVideoId(currentVideoInput);
  const embedUrl = `https://www.youtube.com/embed/${currentVideoId}`;
  const videoHeight = screenHeight / 3;

  const renderItem = ({ item }) => {
    const vid = extractVideoId(item);
    const thumbUrl = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
    const isActive = vid === currentVideoId;

    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.activeItem]}
        onPress={() => setCurrentVideoInput(item)}
        activeOpacity={1}
      >
        <Image source={{ uri: thumbUrl }} style={styles.thumb} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🟦 Top: Main video player */}
      <Text style={styles.title}>🎥 Welcome to Videos Album! </Text>

      <View style={{ width: "100%", height: videoHeight, marginTop: 50 }}>
        <WebView
          source={{ uri: embedUrl }}
          style={{ flex: 1 }}
          allowsFullscreenVideo
          javaScriptEnabled
        />
      </View>

      {/* 🟨 Bottom: Playlist grid */}
      <View style={styles.bottomHalf}>
        <Text style={styles.playlistHeader}>Playlist</Text>
        <FlatList
          data={videos}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4} // ✅ 4 videos per row
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  title: {
  fontSize: 22,
  fontWeight: "bold",
  textAlign: "center",
  color: "#222",
  marginTop: 70, // space from top of screen
  marginBottom: 10, // space before video
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  playlistHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    paddingLeft: 4,
  },
  item: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000", 
  },
  activeItem: {
    borderWidth: 2,
    borderColor: "#007bff",
  },
  thumb: {
    width: "100%",
    height: 90,
  },
});
