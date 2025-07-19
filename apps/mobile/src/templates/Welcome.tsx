import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Font from "expo-font";

// Configure your server URL here
const SERVER_URL = __DEV__
  ? "https://72c4978bd775.ngrok-free.app"
  : "https://router.swooche.com";

const Welcome = () => {
  const [token, setToken] = useState<string | null>(null);
  const [twilioToken, setTwilioToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Modak: require("../../assets/fonts/Modak.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
    registerForPushNotificationsAsync().then(setToken);
  }, []);

  const fetchTwilioToken = async () => {
    setLoading(true);
    try {
      console.log("Fetching Twilio token from:", SERVER_URL);
      const res = await fetch(`${SERVER_URL}/token`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      console.log("Twilio Token:", json);
      setTwilioToken(json.token);
      Alert.alert("Success", "Twilio token fetched successfully!");
      // Automatically navigate to home page after a short delay
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      console.error("Error fetching Twilio token:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", `Failed to fetch Twilio token: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, fontsLoaded && { fontFamily: "Modak" }]}>
        Swooche
      </Text>

      <Text style={styles.label}>Expo Push Token:</Text>
      <Text style={styles.tokenText} selectable>
        {token || "Loading..."}
      </Text>

      <Text style={styles.label}>Server URL:</Text>
      <Text style={styles.urlText} selectable>
        {SERVER_URL}
      </Text>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={fetchTwilioToken}
        disabled={loading}
      >
        <Text style={[styles.buttonText, loading && styles.buttonTextDisabled]}>
          {loading ? "Loading..." : "Fetch Twilio Token"}
        </Text>
      </Pressable>

      {twilioToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.label}>Twilio Token:</Text>
          <Text style={styles.tokenText} selectable>
            {twilioToken}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3B81F6",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    color: "#BEDBFE",
    fontSize: 72,
    marginBottom: 4,
    transform: [{ rotate: "-4deg" }],
    textShadowRadius: 4,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 8,
  },
  tokenText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  urlText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  tokenContainer: {
    marginTop: 16,
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 20,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
    opacity: 0.6,
  },
  buttonText: {
    color: "#3B81F6",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#9CA3AF",
  },
});

async function registerForPushNotificationsAsync() {
  let token: string | null = null;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Error", "Failed to get push token");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert("Warning", "Must use physical device for Push Notifications");
  }

  return token;
}

export { Welcome };
