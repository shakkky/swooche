import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTwilioVoice } from "../contexts/TwilioVoiceContext";

export const LinkedNumbers = () => {
  const { numbers, started } = useTwilioVoice();

  if (!started || !numbers || numbers.length === 0) {
    return null;
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case "calls":
        return "📞";
      case "texts":
        return "💬";
      default:
        return "📱";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Linked Numbers</Text>
      {numbers.map((number) => (
        <View key={number.id} style={styles.numberCard}>
          <Text style={styles.numberText}>{number.number}</Text>
          <View style={styles.capabilitiesContainer}>
            {number.capabilities.map((capability) => (
              <View key={capability} style={styles.capabilityBadge}>
                <Text style={styles.capabilityText}>
                  {getCapabilityIcon(capability)} {capability}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },
  numberCard: {
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  capabilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  capabilityBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  capabilityText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  debugText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
});
