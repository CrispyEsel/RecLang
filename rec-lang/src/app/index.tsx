import { IntelOneMono_400Regular, useFonts } from '@expo-google-fonts/intel-one-mono';
import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT } from '@/constants/reclang';

// This the menu button component on the Home Screen.  
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
      <Text style={[styles.buttonText, textStyle]} adjustsFontSizeToFit numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

// This is the home screen component. 
export default function StartScreen() {
  const [fontLoaded] = useFonts({
    IntelOneMono: IntelOneMono_400Regular,
  });

  if (!fontLoaded) {
    return null;
  }

  async function startTest(version: string) {
    try {
      const response = await fetch('http://127.0.0.1:8000/', { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Server answered ${response.status}`);
      }
    } catch (error) {
      console.error(`BACKEND ERROR: ${error}`);
      // show your error message here instead of leaving
      return;
    }
    router.replace({ pathname: '/comparison', params: { version } });
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
            <MenuButton big label="Image" onPress={() => startTest('real')} />
            <MenuButton big label="Animated" onPress={() => startTest('animated')} />
            <MenuButton big label="Animated + Text" onPress={() => startTest('animated_text')} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  topBar: { alignSelf: 'stretch', alignItems: 'flex-end', paddingTop: 16 },
  heroSection: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  title: { color: COLORS.text, fontFamily: FONT, fontSize: 104, lineHeight: 120, textAlign: 'center' },
  buttonStack: { alignSelf: 'stretch', alignItems: 'center', gap: 50, paddingBottom: 40 },
  button: { backgroundColor: COLORS.button, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  pressed: { backgroundColor: COLORS.buttonPressed },
  buttonText: { color: 'white', fontFamily: FONT, textAlign: 'center' },
  small: { width: 236, height: 77 },
  smallText: { fontSize: 40, lineHeight: 48 },
  large: { width: '100%', maxWidth: 488, height: 122 },
  largeText: { fontSize: 52, lineHeight: 62 },
});