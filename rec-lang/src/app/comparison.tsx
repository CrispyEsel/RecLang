import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT } from '@/constants/reclang';

const TOTAL_ROUNDS = 5;

// Correct image (1 or 2) for each round. Placeholder until real images are added.
const ANSWER_KEY = [1, 2, 1, 1, 2];

const NO_CHOICE = 0;

export default function ComparisonScreen() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState(NO_CHOICE);

  function handleNext() {
    if (choice === NO_CHOICE) {
      return;
    }

    let newScore = score;
    if (choice === ANSWER_KEY[round]) {
      newScore = score + 1;
    }

    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      router.replace({
        pathname: '/finish',
        params: { score: String(newScore), total: String(TOTAL_ROUNDS) },
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
            {round + 1}/{TOTAL_ROUNDS}
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
            style={({ pressed }) => [styles.button, styles.image, pressed && styles.pressed, choice === 1 && styles.selected]}>
            <Text style={[styles.buttonText, styles.imageText]}>Image 1</Text>
          </Pressable>

          <Pressable
            onPress={() => setChoice(2)}
            style={({ pressed }) => [styles.button, styles.image, pressed && styles.pressed, choice === 2 && styles.selected]}>
            <Text style={[styles.buttonText, styles.imageText]}>Image 2</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  topBar: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  roundText: { color: COLORS.text, fontFamily: FONT, fontSize: 32, lineHeight: 40 },
  imageStack: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', gap: 93 },
  button: { backgroundColor: COLORS.button, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: COLORS.buttonPressed },
  selected: { backgroundColor: COLORS.buttonSelected, borderWidth: 4, borderColor: 'white' },
  disabled: { opacity: 0.4 },
  buttonText: { color: 'white', fontFamily: FONT, textAlign: 'center' },
  next: { width: 207, height: 58 },
  nextText: { fontSize: 32, lineHeight: 40 },
  image: { width: '100%', maxWidth: 443, height: 294, borderRadius: 15 },
  imageText: { fontSize: 64, lineHeight: 76 },
});