import { Stack } from 'expo-router';
import React from 'react';
import { Welcome } from '@/templates/Welcome';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Steves home',
      }}
    />
    <Welcome />
  </>
);

export default Home;
