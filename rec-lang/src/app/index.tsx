import { IntelOneMono_400Regular, useFonts } from '@expo-google-fonts/intel-one-mono';
import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MenuButton({ label, onPress, big }: { label: string; onPress: () => void; big: boolean }) {
  let sizeStyle = styles.small;
  let textStyle = styles.smallText;
  if (big) {
    sizeStyle = styles.large;
    textStyle = styles.largeText;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, sizeStyle, pressed && styles.pressed]}>
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </Pressable>
  );
}

export default function StartScreen() {
  const [fontLoaded] = useFonts({
    IntelOneMono: IntelOneMono_400Regular,
  });

  if (!fontLoaded) {
    return null;
  }

  function startTest() {
    router.replace('/comparison');
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <MenuButton big={false} label="Settings" onPress={() => console.log('Settings clicked')} />
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            RecLang
          </Text>
        </View>

        <View style={styles.buttonStack}>
          <MenuButton big label="Image Test" onPress={startTest} />
          <MenuButton big label="Cartoon Test" onPress={startTest} />
          <MenuButton big label="Animated Test" onPress={startTest} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#32313F' },
  safeArea: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  topBar: { alignSelf: 'stretch', alignItems: 'flex-end', paddingTop: 16 },
  heroSection: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  title: { color: 'white', fontFamily: 'IntelOneMono', fontSize: 104, lineHeight: 120, textAlign: 'center' },
  buttonStack: { alignSelf: 'stretch', alignItems: 'center', gap: 50, paddingBottom: 40 },
  button: { backgroundColor: '#7FBDFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: '#5FA4EE' },
  buttonText: { color: 'white', fontFamily: 'IntelOneMono' },
  small: { width: 236, height: 77 },
  smallText: { fontSize: 40, lineHeight: 48 },
  large: { width: '100%', maxWidth: 488, height: 122 },
  largeText: { fontSize: 52, lineHeight: 62 },
});