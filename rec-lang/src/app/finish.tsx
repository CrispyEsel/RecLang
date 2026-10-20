import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FinishScreen() {
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            Finished!
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={[styles.box, styles.scoreBox]}>
            <Text style={styles.boxText}>
              Accuracy: {score}/{total}
            </Text>
          </View>

          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.box, styles.retake, pressed && styles.pressed]}>
            <Text style={styles.boxText}>Retake</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#32313F' },
  safeArea: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  heroSection: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  title: { color: 'white', fontFamily: 'IntelOneMono', fontSize: 104, lineHeight: 120, textAlign: 'center' },
  bottomSection: { alignSelf: 'stretch', alignItems: 'center', gap: 50, paddingBottom: 60 },
  box: { width: '100%', maxWidth: 575, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  scoreBox: { height: 121, backgroundColor: '#77BBF9' },
  retake: { height: 112, backgroundColor: '#7FBDFF' },
  pressed: { backgroundColor: '#5FA4EE' },
  boxText: { color: 'white', fontFamily: 'IntelOneMono', fontSize: 60, lineHeight: 72 },
});