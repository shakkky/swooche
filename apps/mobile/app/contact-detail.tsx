import { Stack } from "expo-router";
import React from "react";
import { ContactDetail } from "@/templates/ContactDetail";

const ContactDetailScreen = () => (
  <>
    <Stack.Screen
      options={{
        headerShown: false,
      }}
    />
    <ContactDetail />
  </>
);

export default ContactDetailScreen;
