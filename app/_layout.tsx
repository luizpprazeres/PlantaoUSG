import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import * as SplashScreen from 'expo-splash-screen';
import { runMigrations } from '@/db';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_700Bold,
  });
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    runMigrations().then(() => setDbReady(true)).catch(console.error);
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbReady) SplashScreen.hideAsync();
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) return null;

  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'fade',
        }}
      />
    </>
  );
}
