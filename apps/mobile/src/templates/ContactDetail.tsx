import React, { useState } from "react";
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

// Mock data for contact details
const mockContactData = {
  name: "John Doe",
  phoneNumber: "+1 (555) 123-4567",
  email: "john.doe@example.com",
  company: "Tech Solutions Inc.",
  avatar: "JD",
};

const mockPreviousCalls = [
  {
    id: 1,
    date: "July 19, 2024",
    duration: "5:23",
    type: "incoming",
    status: "completed",
  },
  {
    id: 2,
    date: "July 15, 2024",
    duration: "12:45",
    type: "outgoing",
    status: "completed",
  },
  {
    id: 3,
    date: "July 10, 2024",
    duration: "8:20",
    type: "incoming",
    status: "completed",
  },
  {
    id: 4,
    date: "July 5, 2024",
    duration: "3:15",
    type: "outgoing",
    status: "missed",
  },
];

const mockMessages = [
  {
    id: 1,
    text: "Thanks for the call today!",
    date: "July 19, 2024",
    time: "2:45 PM",
    type: "received",
  },
  {
    id: 2,
    text: "No problem! Looking forward to our meeting tomorrow.",
    date: "July 19, 2024",
    time: "2:47 PM",
    type: "sent",
  },
  {
    id: 3,
    text: "I'll send you the updated files by EOD.",
    date: "July 18, 2024",
    time: "4:30 PM",
    type: "received",
  },
];

const mockNotes = [
  "Project discussion - need to follow up on design mockups",
  "Meeting scheduled for tomorrow at 3 PM",
  "John mentioned budget constraints - need to review scope",
  "Prefers email communication for detailed discussions",
  "Has experience with React Native development",
];

const ContactDetail = () => {
  const [activeSection, setActiveSection] = useState("notes");
  const [notes] = useState(mockNotes);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#3B81F6" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{mockContactData.avatar}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{mockContactData.name}</Text>
          <Text style={styles.contactCompany}>{mockContactData.company}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() =>
          Alert.alert("Call", `Calling ${mockContactData.name}...`)
        }
      >
        <Ionicons name="call" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderContactDetails = () => (
    <View style={styles.contactDetailsSection}>
      <View style={styles.contactDetailItem}>
        <Ionicons name="call" size={20} color="#6B7280" />
        <Text style={styles.contactDetailText}>
          {mockContactData.phoneNumber}
        </Text>
      </View>
      <View style={styles.contactDetailItem}>
        <Ionicons name="mail" size={20} color="#6B7280" />
        <Text style={styles.contactDetailText}>{mockContactData.email}</Text>
      </View>
      <View style={styles.contactDetailItem}>
        <Ionicons name="business" size={20} color="#6B7280" />
        <Text style={styles.contactDetailText}>{mockContactData.company}</Text>
      </View>
    </View>
  );

  const renderSectionTabs = () => (
    <View style={styles.sectionTabs}>
      {[
        { key: "notes", label: "Notes", icon: "create" },
        { key: "history", label: "History", icon: "time" },
      ].map((section) => (
        <TouchableOpacity
          key={section.key}
          style={[
            styles.sectionTab,
            activeSection === section.key && styles.activeSectionTab,
          ]}
          onPress={() => setActiveSection(section.key)}
        >
          <Ionicons
            name={section.icon as any}
            size={16}
            color={activeSection === section.key ? "#3B81F6" : "#6B7280"}
          />
          <Text
            style={[
              styles.sectionTabText,
              activeSection === section.key && styles.activeSectionTabText,
            ]}
          >
            {section.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNotes = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notes</Text>
      {notes.map((note, index) => (
        <View key={index} style={styles.noteItem}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addNoteButton}
        onPress={() => Alert.alert("Add Note", "Add note functionality")}
      >
        <Ionicons name="add" size={20} color="#3B81F6" />
        <Text style={styles.addNoteText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.section}>
      {/* Previous Calls Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Previous Calls</Text>
        {mockPreviousCalls.map((call) => (
          <View key={call.id} style={styles.callHistoryItem}>
            <View style={styles.callHistoryIcon}>
              <Ionicons
                name={call.type === "incoming" ? "call" : "call-outline"}
                size={20}
                color={call.status === "missed" ? "#EF4444" : "#3B81F6"}
              />
            </View>
            <View style={styles.callHistoryContent}>
              <Text style={styles.callHistoryDate}>{call.date}</Text>
              <Text style={styles.callHistoryDuration}>
                {call.duration} • {call.type} • {call.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Messages Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Messages</Text>
        {mockMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageItem,
              message.type === "sent" && styles.messageSent,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>
              {message.time} • {message.date}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "notes":
        return renderNotes();
      case "history":
        return renderHistory();
      default:
        return renderNotes();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContactDetails()}
      {renderSectionTabs()}
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
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3B81F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  contactCompany: {
    fontSize: 14,
    color: "#6B7280",
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
  contactDetailsSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  contactDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  contactDetailText: {
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 12,
  },
  sectionTabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeSectionTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B81F6",
  },
  sectionTabText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  activeSectionTabText: {
    color: "#3B81F6",
    fontWeight: "500",
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
  historySection: {
    marginBottom: 24,
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
});

export { ContactDetail };
