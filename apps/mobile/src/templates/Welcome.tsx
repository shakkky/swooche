import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configure your server URL here
const SERVER_URL = __DEV__ ? 'http://192.168.1.123:3000' : 'https://your-production-server.com';

const Welcome = () => {
  const [token, setToken] = useState<string | null>(null);
  const [twilioToken, setTwilioToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setToken);
  }, []);

  const fetchTwilioToken = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/token`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      console.log('Twilio Token:', json);
      setTwilioToken(json.token);
      Alert.alert('Success', 'Twilio token fetched successfully!');
    } catch (error) {
      console.error('Error fetching Twilio token:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to fetch Twilio token: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Swooche</Text>
      
      <Text style={styles.label}>Expo Push Token:</Text>
      <Text style={styles.tokenText} selectable>
        {token || 'Loading...'}
      </Text>

      <Text style={styles.label}>Server URL:</Text>
      <Text style={styles.urlText} selectable>
        {SERVER_URL}
      </Text>
      
      <Button 
        title={loading ? "Loading..." : "Fetch Twilio Token"} 
        onPress={fetchTwilioToken}
        disabled={loading}
      />
      
      {twilioToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.label}>Twilio Token:</Text>
          <Text style={styles.tokenText} selectable>
            {twilioToken}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  urlText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  tokenContainer: {
    marginTop: 16,
    width: '100%',
  },
});

async function registerForPushNotificationsAsync() {
  let token: string | null = null;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Error', 'Failed to get push token');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Warning', 'Must use physical device for Push Notifications');
  }
  
  return token;
}

export { Welcome };
