import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock data for call details
const mockCallData = {
  contact: "John Doe",
  phoneNumber: "+1 (555) 123-4567",
  callDate: "July 19, 2024",
  callTime: "2:30 PM",
  duration: "5:23",
  callType: "incoming",
  status: "completed",
};

const mockTranscript = [
  {
    id: 1,
    speaker: "John Doe",
    text: "Hey Shakeel, how's it going?",
    timestamp: "00:05",
  },
  {
    id: 2,
    speaker: "You",
    text: "Hi John! I'm doing great, thanks for asking. How about you?",
    timestamp: "00:12",
  },
  {
    id: 3,
    speaker: "John Doe",
    text: "Pretty good! I wanted to discuss that project we talked about last week.",
    timestamp: "00:25",
  },
  {
    id: 4,
    speaker: "You",
    text: "Absolutely! I've been working on the initial designs. Should we schedule a meeting?",
    timestamp: "00:45",
  },
  {
    id: 5,
    speaker: "John Doe",
    text: "That sounds perfect. How about tomorrow at 3 PM?",
    timestamp: "01:15",
  },
  {
    id: 6,
    speaker: "You",
    text: "Works for me! I'll send you a calendar invite.",
    timestamp: "01:30",
  },
];

const CallDetail = () => {
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#3B81F6" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <TouchableOpacity
          onPress={() => router.push("/contact-detail")}
          style={styles.contactNameContainer}
        >
          <Text style={styles.contactName}>{mockCallData.contact}</Text>
          <Ionicons name="chevron-forward" size={16} color="#3B81F6" />
        </TouchableOpacity>
        <Text style={styles.phoneNumber}>{mockCallData.phoneNumber}</Text>
        <Text style={styles.callInfo}>
          {mockCallData.callDate} • {mockCallData.callTime} •{" "}
          {mockCallData.duration}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() =>
          Alert.alert("Call", `Calling ${mockCallData.contact}...`)
        }
      >
        <Ionicons name="call" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderTranscript = () => (
    <View style={styles.section}>
      {/* Recording Section */}
      <View style={styles.recordingSection}>
        <Text style={styles.sectionTitle}>Call Recording</Text>
        <View style={styles.recordingContainer}>
          <View style={styles.recordingInfo}>
            <Ionicons name="mic" size={24} color="#3B81F6" />
            <Text style={styles.recordingText}>Recording available</Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => Alert.alert("Play", "Playing recording...")}
          >
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.recordingDuration}>Duration: 5:23</Text>
      </View>

      {/* Transcript Section */}
      <View style={styles.transcriptSection}>
        <Text style={styles.sectionTitle}>Call Transcript</Text>
        {mockTranscript.map((entry) => (
          <View key={entry.id} style={styles.transcriptEntry}>
            <View style={styles.transcriptHeader}>
              <Text style={styles.speakerName}>{entry.speaker}</Text>
              <Text style={styles.timestamp}>{entry.timestamp}</Text>
            </View>
            <Text style={styles.transcriptText}>{entry.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    return renderTranscript();
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  callInfo: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  callButton: {
    backgroundColor: "#3B81F6",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  transcriptEntry: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transcriptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B81F6",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  transcriptText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  callHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  callHistoryIcon: {
    marginRight: 12,
  },
  callHistoryContent: {
    flex: 1,
  },
  callHistoryDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  callHistoryDuration: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  messageItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageSent: {
    backgroundColor: "#EBF4FF",
  },
  messageText: {
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  noteItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  addNoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: "#3B81F6",
    borderStyle: "dashed",
  },
  addNoteText: {
    fontSize: 14,
    color: "#3B81F6",
    marginLeft: 8,
  },
  recordingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordingText: {
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 8,
  },
  playButton: {
    backgroundColor: "#3B81F6",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingDuration: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  recordingSection: {
    marginBottom: 24,
  },
  transcriptSection: {
    // No additional styling needed, inherits from parent
  },
  historySection: {
    marginBottom: 24,
  },
});

export { CallDetail };
