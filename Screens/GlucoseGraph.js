import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  SimpleLineIcons,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import moment from "moment";

export default function GlucoseGraph({ navigation }) {
  const [readings, setReadings] = useState([]);
  const [dates, setDates] = useState([]);
  const data = [];

  const GetValueDB = async (key) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) return result;
    else return "";
  };
  //

  useEffect(() => {
    GetValueDB("glucoseReadings").then((value) => {
      let arr = value.split(",");
      arr.reverse();
      arr.forEach((value, index) => {
        arr[index] = parseInt(arr[index]);
      });
      setReadings(arr);
      console.log(arr);
    });

    GetValueDB("glucoseReadingsDates").then((value) => {
      let arr = value.split(",");
      arr.reverse();
      arr.forEach((value, index) => {
        arr[index] = new Date(value);
      });
      setDates(arr);
      console.log(dates);
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
        backgroundColor: "rgba(93, 152, 255, 0.83)",
      }}
    >
      <View
        style={{
          marginHorizontal: 0,
          flexDirection: "row",
          justifyContent: "center",
          // backgroundColor: "rgba(109, 149, 222, 0.7)",
          // height: "5%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: "absolute",
            left: 0,
          }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={"rgba(0, 17, 43, 0.83)"}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "rgba(0, 17, 43, 0.9)",
          }}
        >
          Glucose History
        </Text>
      </View>
      <ImageBackground
        source={require("../assets/_bg.png")}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            padding: 25,
          }}
        >
          <View
            style={{
              width: (Dimensions.get("window").width * 95) / 100,
              height: (Dimensions.get("window").height * 5) / 100,
              backgroundColor: "#FFF",
              alignSelf: "center",
              borderRadius: 10,
              flexDirection: "row",
            }}
          >
            <Text>Prediction(6 months): </Text>
            <Text>420</Text>
          </View>
        </View>
        <ScrollView>
          {readings.map((value, index) => {
            return (
              <View
                key={index}
                style={{
                  paddingTop: 20,
                }}
              >
                <View
                  style={{
                    width: (Dimensions.get("window").width * 95) / 100,
                    height: (Dimensions.get("window").height * 5) / 100,
                    backgroundColor: "#FFF",
                    alignSelf: "center",
                    borderRadius: 10,
                    flexDirection: "row",
                  }}
                >
                  <Text>{value}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
