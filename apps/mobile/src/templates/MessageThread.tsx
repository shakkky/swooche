import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock data for message thread
const mockContactData = {
  name: "John Doe",
  phoneNumber: "+1 (555) 123-4567",
  avatar: "JD",
  status: "online",
};

const mockMessages = [
  {
    id: 1,
    text: "Hey Shakeel, how's it going?",
    timestamp: "2:30 PM",
    type: "received",
    date: "Today",
  },
  {
    id: 2,
    text: "Hi John! I'm doing great, thanks for asking. How about you?",
    timestamp: "2:32 PM",
    type: "sent",
    date: "Today",
  },
  {
    id: 3,
    text: "Pretty good! I wanted to discuss that project we talked about last week.",
    timestamp: "2:35 PM",
    type: "received",
    date: "Today",
  },
  {
    id: 4,
    text: "Absolutely! I've been working on the initial designs. Should we schedule a meeting?",
    timestamp: "2:37 PM",
    type: "sent",
    date: "Today",
  },
  {
    id: 5,
    text: "That sounds perfect. How about tomorrow at 3 PM?",
    timestamp: "2:40 PM",
    type: "received",
    date: "Today",
  },
  {
    id: 6,
    text: "Works for me! I'll send you a calendar invite.",
    timestamp: "2:42 PM",
    type: "sent",
    date: "Today",
  },
  {
    id: 7,
    text: "Thanks! Looking forward to it.",
    timestamp: "2:45 PM",
    type: "received",
    date: "Today",
  },
  {
    id: 8,
    text: "I'll also prepare some mockups to show you during the meeting.",
    timestamp: "2:47 PM",
    type: "sent",
    date: "Today",
  },
];

const MessageThread = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: messageText.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "sent" as const,
        date: "Today",
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#3B81F6" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerInfo}
        onPress={() => router.push("/contact-detail")}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{mockContactData.avatar}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{mockContactData.name}</Text>
          <Text style={styles.contactStatus}>{mockContactData.status}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#3B81F6" />
      </TouchableOpacity>
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

  const renderMessage = (message: any) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.type === "sent" && styles.messageSentContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.type === "sent" && styles.messageSentBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.type === "sent" && styles.messageSentText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTimestamp,
            message.type === "sent" && styles.messageSentTimestamp,
          ]}
        >
          {message.timestamp}
        </Text>
      </View>
    </View>
  );

  const renderSuggestedMessage = () => (
    <View style={styles.suggestedMessageContainer}>
      <View style={styles.suggestedMessageBubble}>
        <View style={styles.suggestedMessageHeader}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI Suggestion</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.suggestedMessageContent}
          onPress={() =>
            setMessageText("Great, which time suits you the best?")
          }
        >
          <Text style={styles.suggestedMessageText}>
            Ask to confirm availability
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMessageThread = () => (
    <ScrollView
      style={styles.messageThread}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.messageThreadContent}
    >
      {messages.map((message) => renderMessage(message))}
      {renderSuggestedMessage()}
    </ScrollView>
  );

  const renderInputSection = () => (
    <View style={styles.inputSection}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add" size={24} color="#6B7280" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity style={styles.emojiButton}>
          <Ionicons name="happy" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.sendButton,
          !messageText.trim() && styles.sendButtonDisabled,
        ]}
        onPress={sendMessage}
        disabled={!messageText.trim()}
      >
        <Ionicons
          name="send"
          size={20}
          color={messageText.trim() ? "#FFFFFF" : "#9CA3AF"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {renderHeader()}
        {renderMessageThread()}
        {renderInputSection()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardAvoidingView: {
    flex: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B81F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  contactStatus: {
    fontSize: 12,
    color: "#10B981",
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
  messageThread: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  messageThreadContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  messageSentContainer: {
    alignItems: "flex-end",
  },
  messageBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageSentBubble: {
    backgroundColor: "#3B81F6",
  },
  messageText: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 22,
    marginBottom: 4,
  },
  messageSentText: {
    color: "#FFFFFF",
  },
  messageTimestamp: {
    fontSize: 11,
    color: "#9CA3AF",
    alignSelf: "flex-end",
  },
  messageSentTimestamp: {
    color: "#E0E7FF",
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 44,
    maxHeight: 120,
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    maxHeight: 100,
    paddingVertical: 4,
  },
  emojiButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButton: {
    backgroundColor: "#3B81F6",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  suggestedMessageContainer: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  suggestedMessageBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: "80%",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestedMessageHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  aiBadge: {
    backgroundColor: "#3B81F6",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aiBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  suggestedMessageContent: {
    paddingHorizontal: 8,
  },
  suggestedMessageText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
});

export { MessageThread };
