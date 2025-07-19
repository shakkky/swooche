import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const ContactDetail = () => {
  const params = useLocalSearchParams();
  const { name, phoneNumbers, image } = params;

  // Parse phone numbers from string back to array
  const phoneNumbersArray = phoneNumbers
    ? JSON.parse(phoneNumbers as string)
    : [];

  const handleCall = (phoneNumber: string) => {
    Alert.alert("Call Contact", `Call ${name} at ${phoneNumber}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => console.log("Calling:", phoneNumber) },
    ]);
  };

  const handleMessage = () => {
    Alert.alert("Message Contact", `Send message to ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Message", onPress: () => console.log("Messaging:", name) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#3B81F6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {image ? (
              <Image
                source={{ uri: image as string }}
                style={styles.contactImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>
                {name ? (name as string).charAt(0).toUpperCase() : "?"}
              </Text>
            )}
          </View>
          <Text style={styles.contactName}>{name}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() =>
              phoneNumbersArray.length > 0 && handleCall(phoneNumbersArray[0])
            }
          >
            <Ionicons name="call" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Phone Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phone Numbers</Text>
          {phoneNumbersArray.length > 0 ? (
            phoneNumbersArray.map((phone: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.phoneNumberItem}
                onPress={() => handleCall(phone)}
              >
                <View style={styles.phoneNumberInfo}>
                  <Ionicons name="call" size={20} color="#3B81F6" />
                  <Text style={styles.phoneNumber}>{phone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPhoneNumbers}>
              No phone numbers available
            </Text>
          )}
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color="#6B7280" />
            <Text style={styles.infoText}>Contact from device</Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  contactImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#3B81F6",
  },
  contactName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  callButton: {
    backgroundColor: "#10B981",
  },
  messageButton: {
    backgroundColor: "#3B82F6",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  phoneNumberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  phoneNumberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  phoneNumber: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  noPhoneNumbers: {
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 12,
  },
});

export default ContactDetail;

// import { ContactDetail } from "@/templates/ContactDetail";

// const ContactDetailScreen = () => (
//   <>
//     <Stack.Screen
//       options={{
//         headerShown: false,
//       }}
//     />
//     <ContactDetail />
//   </>
