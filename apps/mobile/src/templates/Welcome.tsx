import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Configure your server URL here
const SERVER_URL = __DEV__
  ? "https://de2aa73c296f.ngrok-free.app"
  : "https://router.swooche.com";

const Welcome = () => {
  const [token, setToken] = useState<string | null>(null);
  const [twilioToken, setTwilioToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setToken);
  }, []);

  const fetchTwilioToken = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/token`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      console.log("Twilio Token:", json);
      setTwilioToken(json.token);
      Alert.alert("Success", "Twilio token fetched successfully!");
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
      <Text style={styles.title}>Swooche</Text>

      <Text style={styles.label}>Expo Push Token:</Text>
      <Text style={styles.tokenText} selectable>
        {token || "Loading..."}
      </Text>

      <Text style={styles.label}>Server URL:</Text>
      <Text style={styles.urlText} selectable>
        {SERVER_URL}
      </Text>

      <Button
        title={loading ? "Loading..." : "Fetch Twilio Token"}
        onPress={fetchTwilioToken}
        disabled={loading}
      />

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
    fontSize: 56,
    fontWeight: 900,
    marginBottom: 16,
    transform: [{ rotate: "-2deg" }],
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
