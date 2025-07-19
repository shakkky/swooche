import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Font from "expo-font";
import { useTwilioVoice } from "../contexts/TwilioVoiceContext";

const Welcome = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const {
    started,
    error,
    identity,
    deviceState,
    start: startTwilioVoice,
    incomingCall,
  } = useTwilioVoice();

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

  const handleStartTwilioVoice = async () => {
    setLoading(true);
    try {
      await startTwilioVoice();
      Alert.alert("Success", "Twilio Voice device started successfully!");
      // Automatically navigate to home page after a short delay
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      console.error("Error starting Twilio Voice device:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert(
        "Error",
        `Failed to start Twilio Voice device: ${errorMessage}`
      );
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

      <Text style={styles.label}>Twilio Voice Status:</Text>
      <Text style={styles.statusText}>
        {started ? "🟢 Started" : "🔴 Not Started"}
      </Text>

      {identity && (
        <>
          <Text style={styles.label}>Agent Identity:</Text>
          <Text style={styles.identityText} selectable>
            {identity}
          </Text>
        </>
      )}

      {deviceState && (
        <>
          <Text style={styles.label}>Device State:</Text>
          <Text style={styles.statusText}>{deviceState}</Text>
        </>
      )}

      {error && (
        <>
          <Text style={styles.label}>Error:</Text>
          <Text style={styles.errorText}>{error}</Text>
        </>
      )}

      {incomingCall && (
        <View style={styles.incomingCallContainer}>
          <Text style={styles.incomingCallText}>
            📞 Incoming call from: {incomingCall.from}
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.button, (loading || started) && styles.buttonDisabled]}
        onPress={handleStartTwilioVoice}
        disabled={loading || started}
      >
        <Text
          style={[
            styles.buttonText,
            (loading || started) && styles.buttonTextDisabled,
          ]}
        >
          {loading
            ? "Starting..."
            : started
            ? "Voice Device Started"
            : "Start Twilio Voice Device"}
        </Text>
      </Pressable>
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
  statusText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  identityText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  incomingCallContainer: {
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  incomingCallText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
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
