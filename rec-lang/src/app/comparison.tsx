import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT } from '@/constants/reclang';

const API_URL = 'http://127.0.0.1:8000';
const SPEAKER_URL = `${API_URL}/image/speaker.png`;
const PREVIEW_MS = 5000;
const PROMPT_MS = 2000;
const RESPONSE_MS = 5000;

const PRESS_GREEN = '#34C759';

type Round = {
  id: number;
  version: string;
  word: string;
  category: string;
  prompt: string;
  left: string;
  right: string;
  correct: string; // this will be 'left' or 'right', decided on backend
};

type Phase = 'preview' | 'prompt' | 'response';
type Status = 'loading' | 'ready' | 'empty' | 'error';
type Answer = 'target' | 'distractor' | 'none';

type TrialResult = {
  trial_id: number;
  word: string;
  category: string;
  target_side: string;
  response: Answer;
  reaction_ms: number | null;
  replays: number;
};

export default function ComparisonScreen() {
  const { version } = useLocalSearchParams<{ version: string }>();
  const { width, height } = useWindowDimensions(); // updates when the screen rotates or resizes

  // The below states will be used to track their variables, set(variable) will setup its input
  const [rounds, setRounds] = useState<Round[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('preview');

  const results = useRef<TrialResult[]>([]);
  const responseStart = useRef(0);
  const replays = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  // Get the list of rounds from the backend when the screen opens
  useEffect(() => {
    async function loadRounds() {
      try {
        const response = await fetch(`${API_URL}/tests/${version}/rounds`, { method: 'GET' });
        if (!response.ok) {
          throw new Error('Could not load rounds');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error(`Backend said: ${JSON.stringify(data)}`);
        }
        if (data.length === 0) {
          setStatus('empty');
          return;
        }
        setRounds(data);
        setStatus('ready');
      } catch (error) {
        console.error(`BACKEND ERROR: ${error}`);
        setStatus('error');
      }
    }
    loadRounds();
  }, [version]);

  // Runs each phase of a trial: preview -> prompt -> response
  useEffect(() => {
    if (status !== 'ready') {
      return;
    }
    clearTimer();

    if (phase === 'preview') {
      timer.current = setTimeout(() => setPhase('prompt'), PREVIEW_MS);
    }

    if (phase === 'prompt') {
      // Placeholder until audio is added: wait a fixed time, then open the response window
      console.log(`PROMPT: ${rounds[trialIndex].prompt}`);
      timer.current = setTimeout(() => setPhase('response'), PROMPT_MS);
    }

    if (phase === 'response') {
      responseStart.current = Date.now();
      timer.current = setTimeout(() => finishTrial('none'), RESPONSE_MS);
    }

    return () => clearTimer();
  }, [phase, trialIndex, status]);

  function finishTrial(answer: Answer) {
    clearTimer();

    const current = rounds[trialIndex];
    let reaction: number | null = null;
    if (answer !== 'none') {
      reaction = Date.now() - responseStart.current;
    }

    results.current.push({
      trial_id: current.id,
      word: current.word,
      category: current.category,
      target_side: current.correct,
      response: answer,
      reaction_ms: reaction,
      replays: replays.current,
    });

    const next = trialIndex + 1;
    if (next >= rounds.length) {
      endTest();
      return;
    }

    replays.current = 0;
    setTrialIndex(next);
    setPhase('preview');
  }

  async function endTest() {
    const all = results.current;
    let score = 0;
    for (const result of all) {
      if (result.response === 'target') {
        score += 1;
      }
    }

    try {
      await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version, results: all }),
      });
    } catch (error) {
      console.error(`SAVE ERROR: ${error}`);
    }

    router.replace({
      pathname: '/finish',
      params: { score: String(score), total: String(all.length) },
    });
  }

  // Touches only count after the question has been "said"
  function handleTap(side: string) {
    if (phase !== 'response') {
      return;
    }
    let answer: Answer = 'distractor';
    if (side === rounds[trialIndex].correct) {
      answer = 'target';
    }
    finishTrial(answer);
  }

  // Replays the question (for now just reruns the prompt timer); response window restarts after
  function handleReplay() {
    if (phase !== 'response') {
      return;
    }
    replays.current += 1;
    setPhase('prompt');
  }

  // Wait for the rounds before drawing anything that uses them
  if (status !== 'ready') {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.message}>{status}</Text>
      </View>
    );
  }

  const current = rounds[trialIndex];
  const locked = phase !== 'response';
  const showText = version === 'animated_text';

  // Side by side when the screen is wider than tall, stacked otherwise
  const isLandscape = width > height;
  let layoutStyle = styles.imageColumn;
  let boxSizeStyle = styles.boxStacked;
  if (isLandscape) {
    layoutStyle = styles.imageRow;
    boxSizeStyle = styles.boxSideBySide;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Pressable
              onPress={handleReplay}
              disabled={locked}
              accessibilityLabel="Play the question again"
              style={({ pressed }) => [styles.speaker, pressed && styles.speakerPressed, locked && styles.disabled]}>
              <Image
                source={{ uri: SPEAKER_URL }}
                style={styles.speakerImage}
                resizeMode="contain"
                onError={() => console.log(`Speaker image failed: ${SPEAKER_URL}`)}
              />
            </Pressable>
          </View>

          <View style={styles.topCenter}>
            {showText && <Text style={styles.topText}>Find: {current.word}</Text>}
          </View>

          <View style={styles.topRight}>
            <Text style={styles.topText}>
              {trialIndex + 1}/{rounds.length}
            </Text>
          </View>
        </View>

        <View style={styles.phaseBar}>
          {phase === 'preview' && <Text style={styles.phaseText}>Preview</Text>}
        </View>

        <View style={layoutStyle}>
          <Pressable
            onPress={() => handleTap('left')}
            style={({ pressed }) => [styles.imageBox, boxSizeStyle, pressed && !locked && styles.boxPressed]}>
            <Image key={`left-${trialIndex}`} source={{ uri: `${API_URL}${current.left}` }} style={styles.image} resizeMode="cover" />
          </Pressable>

          <Pressable
            onPress={() => handleTap('right')}
            style={({ pressed }) => [styles.imageBox, boxSizeStyle, pressed && !locked && styles.boxPressed]}>
            <Image key={`right-${trialIndex}`} source={{ uri: `${API_URL}${current.right}` }} style={styles.image} resizeMode="cover" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1, paddingHorizontal: 24 },

  // Top bar: speaker on the left, "Find:" centered, trial counter on the right
  topBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 16 },
  topLeft: { flex: 1, alignItems: 'flex-start' },
  topCenter: { alignItems: 'center' },
  topRight: { flex: 1, alignItems: 'flex-end' },
  topText: { color: COLORS.text, fontFamily: FONT, fontSize: 48, lineHeight: 58 },

  speaker: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerPressed: { transform: [{ scale: 0.9 }] },
  speakerImage: { width: 72, height: 72 },

  // "Preview" label; the bar keeps its height so the pictures don't jump when the label disappears
  phaseBar: { height: 56, alignItems: 'center', justifyContent: 'center' },
  phaseText: { color: COLORS.text, fontFamily: FONT, fontSize: 40, lineHeight: 50 },

  // Landscape: side by side
  imageRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40 },
  boxSideBySide: { flex: 1, maxWidth: 480 },

  // Portrait: stacked
  imageColumn: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 },
  boxStacked: { width: '100%', maxWidth: 480 },

  imageBox: {
    aspectRatio: 4 / 3,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.button,
    borderWidth: 6,
    borderColor: 'transparent', // always has a border so the picture doesn't shift when it turns green
  },
  boxPressed: { borderColor: PRESS_GREEN },
  image: { width: '100%', height: '100%' },

  disabled: { opacity: 0.4 },
  message: { color: COLORS.text, fontFamily: FONT, fontSize: 32, lineHeight: 40, textAlign: 'center' },
});