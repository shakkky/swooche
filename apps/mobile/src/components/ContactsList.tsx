import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Contacts from "expo-contacts";

type Contact = {
  id: string;
  name: string;
  phoneNumbers: string[];
  image?: string;
};

const ContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
        await loadContacts();
      } else {
        setPermissionGranted(false);
        Alert.alert(
          "Permission Required",
          "Please grant contacts permission to view your contacts."
        );
      }
    } catch (error) {
      console.error("Error requesting contacts permission:", error);
      setPermissionGranted(false);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Name,
          Contacts.Fields.Image,
        ],
      });

      if (data.length > 0) {
        const formattedContacts: Contact[] = data
          .filter((contact) => contact.name && contact.phoneNumbers)
          .map((contact) => ({
            id: contact.id || "",
            name: contact.name || "Unknown",
            phoneNumbers:
              contact.phoneNumbers?.map((phone) => phone.number || "") || [],
            image: contact.image?.uri || "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setContacts(formattedContacts);
        setFilteredContacts(formattedContacts);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      Alert.alert("Error", "Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactPress = (contact: Contact) => {
    // Navigate to contact detail screen
    router.push({
      pathname: "/contact-detail",
      params: {
        name: contact.name,
        phoneNumbers: JSON.stringify(contact.phoneNumbers),
        image: contact.image || "",
      },
    });
  };

  const renderContactAvatarFallback = (contact: Contact) => {
    const names = contact.name.split(" ");
    if (names.length > 1) {
      return (
        <Text style={styles.avatarText}>
          {names[0]?.charAt(0).toUpperCase()}
          {names[names.length - 1]?.charAt(0).toUpperCase()}
        </Text>
      );
    }

    return (
      <Text style={styles.avatarText}>
        {contact.name.charAt(0).toUpperCase()}
      </Text>
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.contactAvatar}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.contactImage}
            resizeMode="cover"
          />
        ) : (
          renderContactAvatarFallback(item)
        )}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneNumbers.length > 0 && (
          <Text style={styles.contactPhone}>
            {item.phoneNumbers[0]}
            {item.phoneNumbers.length > 1 &&
              ` (+${item.phoneNumbers.length - 1} more)`}
          </Text>
        )}
      </View>
      <Ionicons name="call" size={20} color="#3B81F6" />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B81F6" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="people" size={64} color="#6B7280" />
        <Text style={styles.permissionTitle}>Contacts Permission Required</Text>
        <Text style={styles.permissionText}>
          To view your contacts, please grant permission in your device
          settings.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestContactsPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {searchQuery ? "No contacts found" : "No contacts available"}
            </Text>
          </View>
        }
      />

      {/* Contact Count */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {filteredContacts.length} contact
          {filteredContacts.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B81F6",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: "#6B7280",
  },
  sectionHeader: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export { ContactsList };
