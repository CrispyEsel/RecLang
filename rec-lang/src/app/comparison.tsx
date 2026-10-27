import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT } from '@/constants/reclang';

const API_URL = 'http://127.0.0.1:8000';
const NO_CHOICE = 0;

type Round = {
  id: number;
  image_1: string;
  image_2: string;
  correct: number;
};

export default function ComparisonScreen() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState(NO_CHOICE);

  // Get the list of rounds from the backend when the screen opens
  useEffect(() => {
    async function loadRounds() {
      try {
        const response = await fetch(`${API_URL}/tests/image/rounds`, { method: 'GET' });
        if (!response.ok) {
          throw new Error('Could not load rounds');
        }
        const data = await response.json();
        console.log('Rounds from backend:', data);
        setRounds(data);
      } catch (error) {
        console.error(`BACKEND ERROR: ${error}`);
      }
    }
    loadRounds();
  }, []);

  if (rounds.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.roundText}>Loading...</Text>
      </View>
    );
  }

  const totalRounds = rounds.length;
  const current = rounds[round];
  const imageUrl1 = `${API_URL}${current.image_1}`;
  const imageUrl2 = `${API_URL}${current.image_2}`;

  function handleNext() {
    if (choice === NO_CHOICE) {
      return;
    }

    let newScore = score;
    if (choice === current.correct) {
      newScore = score + 1;
    }

    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      router.replace({
        pathname: '/finish',
        params: { score: String(newScore), total: String(totalRounds) },
      });
      return;
    }

    setScore(newScore);
    setRound(nextRound);
    setChoice(NO_CHOICE);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Text style={styles.roundText}>
            {round + 1}/{totalRounds}
          </Text>
          <Pressable
            onPress={handleNext}
            disabled={choice === NO_CHOICE}
            style={({ pressed }) => [
              styles.button,
              styles.next,
              pressed && styles.pressed,
              choice === NO_CHOICE && styles.disabled,
            ]}>
            <Text style={[styles.buttonText, styles.nextText]}>Next</Text>
          </Pressable>
        </View>

        <View style={styles.imageStack}>
          <Pressable
            onPress={() => setChoice(1)}
            style={({ pressed }) => [styles.imageBox, pressed && styles.imagePressed, choice === 1 && styles.selected]}>
            <Image
              source={{ uri: imageUrl1 }}
              style={styles.image}
              resizeMode="cover"
              onError={() => console.log(`Image failed: ${imageUrl1}`)}
            />
          </Pressable>

          <Pressable
            onPress={() => setChoice(2)}
            style={({ pressed }) => [styles.imageBox, pressed && styles.imagePressed, choice === 2 && styles.selected]}>
            <Image
              source={{ uri: imageUrl2 }}
              style={styles.image}
              resizeMode="cover"
              onError={() => console.log(`Image failed: ${imageUrl2}`)}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  topBar: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  roundText: { color: COLORS.text, fontFamily: FONT, fontSize: 32, lineHeight: 40 },
  imageStack: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', gap: 60 },
  button: { backgroundColor: COLORS.button, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: COLORS.buttonPressed },
  disabled: { opacity: 0.4 },
  buttonText: { color: COLORS.text, fontFamily: FONT, textAlign: 'center' },
  next: { width: 207, height: 58 },
  nextText: { fontSize: 32, lineHeight: 40 },
  imageBox: {
    width: 443,
    maxWidth: '100%',
    height: 294,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.button,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  imagePressed: { opacity: 0.8 },
  selected: { borderColor: COLORS.text },
  image: { width: '100%', height: '100%' },
});