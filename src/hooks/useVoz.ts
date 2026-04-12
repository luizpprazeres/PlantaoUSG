import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// expo-speech-recognition só funciona em dev client / produção nativa
// No Expo Go e web usa stubs que não crasham
const isExpoGo = Constants.appOwnership === 'expo';
const isWeb = Platform.OS === 'web';
const canUseVoice = !isExpoGo && !isWeb;

let ExpoSpeechRecognitionModule: any = {
  stop: () => {},
  start: () => {},
  requestPermissionsAsync: async () => ({ granted: false }),
};
let useSpeechRecognitionEvent: (event: string, handler: (e: any) => void) => void = () => {};

if (canUseVoice) {
  try {
    const sr = require('expo-speech-recognition');
    ExpoSpeechRecognitionModule = sr.ExpoSpeechRecognitionModule;
    useSpeechRecognitionEvent = sr.useSpeechRecognitionEvent;
  } catch {
    // módulo não disponível neste ambiente
  }
}

export function useVoz(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript ?? '';
    if (transcript) onResult(transcript);
  });

  useSpeechRecognitionEvent('end', () => setListening(false));
  useSpeechRecognitionEvent('error', () => setListening(false));

  const toggle = useCallback(async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      setListening(false);
    } else {
      const { granted } =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) return;
      ExpoSpeechRecognitionModule.start({
        lang: 'pt-BR',
        continuous: true,
        interimResults: true,
      });
      setListening(true);
    }
  }, [listening]);

  return { listening, toggle };
}
