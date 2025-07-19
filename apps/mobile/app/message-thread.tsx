import { Stack } from "expo-router";
import React from "react";
import { MessageThread } from "@/templates/MessageThread";

const MessageThreadScreen = () => (
  <>
    <Stack.Screen
      options={{
        headerShown: false,
      }}
    />
    <MessageThread />
  </>
);

export default MessageThreadScreen;
