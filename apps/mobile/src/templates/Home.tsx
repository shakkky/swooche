import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome Shakeel</Text>
              <Text style={styles.welcomeSubtitle}>
                Here's what's been happening lately
              </Text>
            </View>
            {renderRecentActivity()}
          </ScrollView>
        );
      case "contacts":
        return (
          <View style={styles.content}>
            <Text style={styles.placeholderText}>Contacts</Text>
          </View>
        );
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
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  activityContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
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
