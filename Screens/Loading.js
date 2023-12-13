import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
// import Video from "react-native-video";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import * as SecureStore from "expo-secure-store";
// import medicoachLogo from "../assets/medicoachLogo.mp4";

export default function Loading({ navigation }) {
  const [currentPage, setCurrentPage] = useState(1);
  const GetValueDB = async (key) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) return result;
    else return "";
  };

  async function SetValueDB(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
        backgroundColor: "rgba(93, 152, 255, 0.83)",
      }}
    >
      {/* <Video
        source={medicoachLogo} // the video file
        paused={false} // make it start      // any style you want
        repeat={true} // make it a loop
      /> */}
      <TouchableOpacity
        style={{
          height: 40,
          width: 290,
          backgroundColor: "#00213b",
          borderRadius: 5,
        }}
        onPress={() => navigation.navigate("BottomTabNavigation")}
      >
        <Text
          style={{
            fontSize: 22,
            color: "rgba(170, 219, 255,1)",
            paddingLeft: "30%",
            paddingVertical: 5,
            alignItems: "center",
          }}
        >
          Continue
        </Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          style={{
            position: "absolute",
            paddingLeft: "90%",
            paddingVertical: 8,
            color: "rgba(170, 219, 255, 1)",
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
