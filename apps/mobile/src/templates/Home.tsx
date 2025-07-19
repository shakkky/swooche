import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTwilioVoice } from "../contexts/TwilioVoiceContext";
import { useAuth } from "../contexts/AuthContext";
import { ContactsList } from "../components/ContactsList";
import { LinkedNumbers } from "../components/LinkedNumbers";

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    type: "call",
    contact: "John Doe",
    time: "2 minutes ago",
    duration: "5:23",
    icon: "call",
  },
  {
    id: 2,
    type: "message",
    contact: "Jane Smith",
    time: "15 minutes ago",
    preview: "Hey, how's it going?",
    icon: "chatbubble",
  },
  {
    id: 3,
    type: "call",
    contact: "Mike Johnson",
    time: "1 hour ago",
    duration: "12:45",
    icon: "call",
  },
  {
    id: 4,
    type: "message",
    contact: "Sarah Wilson",
    time: "2 hours ago",
    preview: "Thanks for the help!",
    icon: "chatbubble",
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { logout } = useAuth();

  const {
    started,
    identity,
    deviceState,
    incomingCall,
    callStatus,
    callDuration,
    error,
    acceptCall,
    rejectCall,
    endCall,
    start: startTwilioVoice,
  } = useTwilioVoice();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAcceptCall = () => {
    acceptCall();
  };

  const handleRejectCall = () => {
    rejectCall();
  };

  const handleEndCall = () => {
    Alert.alert("End Call", "Are you sure you want to end the current call?", [
      { text: "Cancel", style: "cancel" },
      { text: "End Call", style: "destructive", onPress: endCall },
    ]);
  };

  const handleConnect = async () => {
    try {
      await startTwilioVoice();
      Alert.alert("Success", "Connected to Twilio Voice!");
    } catch (error) {
      Alert.alert("Connection Error", "Failed to connect. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const renderRecentActivity = () => (
    <View style={styles.activityContainer}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentActivity?.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={styles.activityItem}
          onPress={() => {
            if (activity.type === "call") {
              router.push("/call-detail");
            } else if (activity.type === "message") {
              router.push("/message-thread");
            }
          }}
        >
          <View style={styles.activityIcon}>
            <Ionicons name={activity.icon as any} size={20} color="#3B81F6" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityContact}>{activity.contact}</Text>
            <Text style={styles.activityDetails}>
              {activity.type === "call"
                ? `${activity.duration} • ${activity.time}`
                : activity.preview}
            </Text>
          </View>
          <Text style={styles.activityTime}>
            {activity.type === "message" ? activity.time : ""}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConnectionStatus = () => {
    if (started && deviceState === "registered") {
      return (
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Voice Device Status</Text>
          <Text style={styles.statusText}>
            Status: 🟢 Ready to receive calls
          </Text>
          {identity && <Text style={styles.statusText}>Agent: {identity}</Text>}
          <Text style={styles.statusText}>Device: {deviceState}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.connectionContainer}>
          <Text style={styles.sectionTitle}>Voice Device Status</Text>
          <Text style={styles.connectionText}>
            Status: 🔴 Not ready to receive calls
          </Text>
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
          <Pressable style={styles.connectButton} onPress={handleConnect}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </Pressable>
        </View>
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome {identity}</Text>
              <Text style={styles.welcomeSubtitle}>
                Here's what's been happening lately
              </Text>
            </View>

            {/* Connection Status */}
            {renderConnectionStatus()}

            {/* Linked Numbers */}
            <LinkedNumbers />

            {/* Incoming Call */}
            {incomingCall && (
              <View style={styles.incomingCallContainer}>
                <Text style={styles.incomingCallTitle}>📞 Incoming Call</Text>
                <Text style={styles.incomingCallText}>
                  From: {incomingCall.from}
                </Text>
                <View style={styles.callButtons}>
                  <Pressable
                    style={[styles.callButton, styles.rejectButton]}
                    onPress={handleRejectCall}
                  >
                    <Text style={styles.callButtonText}>Reject</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.callButton, styles.acceptButton]}
                    onPress={handleAcceptCall}
                  >
                    <Text style={styles.callButtonText}>Accept</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Active Call */}
            {callStatus === "open" && (
              <View style={styles.activeCallContainer}>
                <Text style={styles.activeCallTitle}>📞 Active Call</Text>
                <Text style={styles.callDuration}>
                  Duration: {formatDuration(callDuration)}
                </Text>
                <Pressable
                  style={[styles.callButton, styles.endCallButton]}
                  onPress={handleEndCall}
                >
                  <Text style={styles.callButtonText}>End Call</Text>
                </Pressable>
              </View>
            )}

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>How to use:</Text>
              <Text style={styles.instructionsText}>
                1. Make sure the voice device is connected (green status)
              </Text>
              <Text style={styles.instructionsText}>
                2. When a call comes in, you'll see an alert and call controls
              </Text>
              <Text style={styles.instructionsText}>
                3. Accept or reject incoming calls using the buttons
              </Text>
              <Text style={styles.instructionsText}>
                4. Use the "End Call" button to hang up during active calls
              </Text>
            </View>

            {/* Recent Activity */}
            {renderRecentActivity()}
          </ScrollView>
        );
      case "contacts":
        return <ContactsList />;
      case "messages":
        return (
          <View style={styles.content}>
            <Text style={styles.placeholderText}>Messages</Text>
          </View>
        );
      case "phone":
        return (
          <View style={styles.content}>
            <Text style={styles.placeholderText}>Phone</Text>
          </View>
        );
      case "settings":
        return (
          <View style={styles.content}>
            <Text style={styles.placeholderText}>Settings</Text>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderTabContent()}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "home" && styles.activeTab]}
          onPress={() => setActiveTab("home")}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === "home" ? "#3B81F6" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "home" && styles.activeTabText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "contacts" && styles.activeTab]}
          onPress={() => setActiveTab("contacts")}
        >
          <Ionicons
            name="people"
            size={24}
            color={activeTab === "contacts" ? "#3B81F6" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "contacts" && styles.activeTabText,
            ]}
          >
            Contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "messages" && styles.activeTab]}
          onPress={() => setActiveTab("messages")}
        >
          <Ionicons
            name="chatbubbles"
            size={24}
            color={activeTab === "messages" ? "#3B81F6" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "messages" && styles.activeTabText,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "phone" && styles.activeTab]}
          onPress={() => setActiveTab("phone")}
        >
          <Ionicons
            name="call"
            size={24}
            color={activeTab === "phone" ? "#3B81F6" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "phone" && styles.activeTabText,
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "settings" && styles.activeTab]}
          onPress={() => setActiveTab("settings")}
        >
          <Ionicons
            name="settings"
            size={24}
            color={activeTab === "settings" ? "#3B81F6" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "settings" && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  statusContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionContainer: {
    backgroundColor: "#FEF2F2",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FCA5A5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  connectionText: {
    fontSize: 16,
    color: "#DC2626",
    marginBottom: 12,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 12,
  },
  connectButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  incomingCallContainer: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  incomingCallTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
    marginBottom: 8,
  },
  incomingCallText: {
    fontSize: 16,
    color: "#92400E",
    marginBottom: 16,
  },
  callButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  callButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  rejectButton: {
    backgroundColor: "#EF4444",
  },
  endCallButton: {
    backgroundColor: "#EF4444",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  activeCallContainer: {
    backgroundColor: "#DBEAFE",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  activeCallTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 8,
  },
  callDuration: {
    fontSize: 18,
    color: "#1E40AF",
    marginBottom: 16,
    textAlign: "center",
  },
  instructionsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  activityContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityContact: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 14,
    color: "#6B7280",
  },
  activityTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTab: {
    // Active state styling
  },
  tabText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  activeTabText: {
    color: "#3B81F6",
    fontWeight: "500",
  },
  placeholderText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 50,
  },
});

export { Home };
