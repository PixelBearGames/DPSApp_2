import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Button,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { SimpleLinearRegression } from "ml-regression-simple-linear";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export default function Main({ navigation }) {
  let glucoseReadings = [];

  let today = new Date();
  let checkupDate = new Date();

  const checkupDuration = 20;

  const [checkupDay, setCheckupDay] = useState();
  const [remainingDays, setRemainingDays] = useState(checkupDuration);

  const [showAlert, setShowAlert] = useState(false);

  const GetValueDB = async (key) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) return result;
    else return "";
  };

  async function SetValueDB(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  function ResetCheckupDuration() {
    checkupDate.setDate(checkupDate.getDate() + checkupDuration);
    checkupDate.setHours(0, 0, 0);
    setCheckupDay(checkupDate);
    SetValueDB("checkupDate", checkupDate.toDateString());
    setRemainingDays(checkupDuration - 1);
  }

  //SecureStore.deleteItemAsync("checkupDate");
  SecureStore.deleteItemAsync("glucoseReadings");

  useEffect(() => {
    today = new Date();
    checkupDate = new Date();

    GetValueDB("checkupDate").then((value) => {
      if (value == "") {
        ResetCheckupDuration();
      } else {
        checkupDate = new Date(value);
        setRemainingDays(
          Math.floor((checkupDate - today) / (1000 * 60 * 60 * 24))
        );
      }
    });

    GetValueDB("glucoseReadings").then((value) => {
      if (value == "") {
      } else {
        glucoseReadings = value.split(",");
        console.log(glucoseReadings);
      }
    });
  }, []);

  useEffect(() => {
    if (remainingDays == 0) {
      setShowAlert(true);
    }
  }, [remainingDays]);

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
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "sans-serif",
            fontWeight: "bold",
            //paddingLeft: "43%",
          }}
        >
          Home
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
            position: "absolute",
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            paddingTop: 180,
            display: "none",
          }}
        >
          <View
            style={{
              height: "40%",
              width: "70%",
              backgroundColor: "#FFF",
              alignSelf: "center",
              paddingTop: 30,
            }}
          ></View>
        </View>

        <ScrollView>
          <View
            style={{ paddingTop: 10, display: showAlert ? "flex" : "none" }}
          >
            <View
              style={{
                height: 50,
                width: "98%",
                backgroundColor: "rgba(250,62,62,0.7)",
                borderRadius: 15,
                borderColor: "#96333d",
                borderWidth: 3.5,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  fontSize: 22,
                  paddingTop: "1%",
                  paddingLeft: "5%",
                  color: "rgba(255,198,196,1)",
                }}
              >
                Get checkup done today!!
              </Text>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  paddingTop: 5,
                  paddingLeft: "83%",
                }}
                onPress={() => {
                  setShowAlert(false);
                  ResetCheckupDuration();
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: 50,
                    backgroundColor: "rgba(255,198,196,1)",
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      fontSize: 16,
                      paddingVertical: 4,
                      alignSelf: "center",
                      color: "#96333d",
                    }}
                  >
                    DONE
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ backgroundColor: "rgba(0, 33, 59, 0.3)" }}>
            <Text
              style={{
                fontSize: 50,
                alignSelf: "center",
                color: "rgba(180, 229, 255, 0.87)",
              }}
            >
              {remainingDays}
            </Text>
            <Text
              style={{
                fontSize: 25,
                alignSelf: "center",
                color: "rgba(190, 239, 255, 0.87)",
              }}
            >
              Days till next checkup
            </Text>
          </View>
          <View
            style={{
              height: 260,
            }}
          >
            <LineChart
              data={{
                //labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={(Dimensions.get("window").width * 70) / 100} // from react-native
              height={190}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#00dee2",
                backgroundGradientFrom: "rgba(74, 137, 255, 1)",
                backgroundGradientFromOpacity: 0.8,
                backgroundGradientTo: "rgba(74, 183, 255, 1)",
                backgroundGradientToOpacity: 0.8,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#0051d4",
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                paddingTop: 15,
                paddingLeft: 10,
              }}
            />

            <View
              style={{
                position: "absolute",
                paddingTop: 40,
                paddingLeft: "80%",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 70,
                  width: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 10,
                }}
              >
                <MaterialIcons name="add-chart" size={64} color={"#00213b"} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "absolute",
                paddingTop: 130,
                paddingLeft: "80%",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 70,
                  width: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 10,
                }}
              >
                <MaterialIcons name="history" size={64} color={"#00213b"} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "absolute",
                paddingTop: 225,
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 290,
                  backgroundColor: "#00213b",
                  borderRadius: 5,
                }}
                onPress={() => navigation.navigate("Glucose")}
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
                  Show More
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
            </View>
          </View>

          <View
            style={{
              height: 260,
            }}
          >
            <LineChart
              data={{
                //labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={(Dimensions.get("window").width * 70) / 100} // from react-native
              height={190}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#00dee2",
                backgroundGradientFrom: "rgba(74, 137, 255, 1)",
                backgroundGradientFromOpacity: 0.8,
                backgroundGradientTo: "rgba(74, 183, 255, 1)",
                backgroundGradientToOpacity: 0.8,
                borderRadius: 16,
                borderColor: "#0051d4",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#0051d4",
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                paddingTop: 15,
                paddingLeft: 10,
              }}
            />

            <View
              style={{
                position: "absolute",
                paddingTop: 40,
                paddingLeft: "80%",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 70,
                  width: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 10,
                }}
              >
                <MaterialIcons name="add-chart" size={64} color={"#00213b"} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "absolute",
                paddingTop: 130,
                paddingLeft: "80%",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 70,
                  width: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 10,
                }}
              >
                <MaterialIcons name="history" size={64} color={"#00213b"} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "absolute",
                paddingTop: 225,
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 290,
                  backgroundColor: "#00213b",
                  borderRadius: 5,
                }}
                onPress={() => navigation.navigate("BloodPressure")}
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
                  Show More
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
            </View>
          </View>

          {/* Workout page button */}
          <View
            style={{
              paddingTop: 30,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: 140,
                width: 120,
                alignContent: "flex-end",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 10,
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("WorkoutPlan")}
            >
              <Image
                source={require("../assets/WorkoutPlan.png")}
                style={{
                  width: 100,
                  height: 100,
                  position: "absolute",
                  paddingTop: 40,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <View style={{ width: 40 }}></View>
            {/* Diet page button */}
            <TouchableOpacity
              style={{
                height: 140,
                width: 120,
                alignContent: "flex-end",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 10,
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("DietChart")}
            >
              <Image
                source={require("../assets/DietChart.png")}
                style={{
                  width: 100,
                  height: 100,
                  position: "absolute",
                  paddingTop: 40,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 130,
            }}
          />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
