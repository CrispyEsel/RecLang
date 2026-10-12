import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const COLORS = {
  background: '#32313F',
  button: '#7FBDFF',
  buttonPressed: '#5FA4EE',
  text: '#FFFFFF',
};

// Must match the name you register with expo-font (see note at bottom).
const FONT = 'IntelOneMono';

type MenuButtonProps = {
  label: string;
  onPress: () => void;
  size?: 'large' | 'small';
};

function MenuButton({ label, onPress, size = 'large' }: MenuButtonProps) {
  const isSmall = size === 'small';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        isSmall ? styles.buttonSmall : styles.buttonLarge,
        pressed && styles.buttonPressed,
      ]}>
      <ThemedText style={[styles.buttonText, isSmall ? styles.buttonTextSmall : styles.buttonTextLarge]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top bar: Settings in the top-right */}
        <View style={styles.topBar}>
          <MenuButton size="small" label="Settings" onPress={() => console.log('Settings clicked')} />
        </View>

        {/* Title */}
        <View style={styles.heroSection}>
          <ThemedText style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            RecLang
          </ThemedText>
        </View>

        {/* Test buttons */}
        <View style={styles.buttonStack}>
          <MenuButton label="Image Test" onPress={() => console.log('Image Test clicked')} />
          <MenuButton label="Cartoon Test" onPress={() => console.log('Cartoon Test clicked')} />
          <MenuButton label="Animated Test" onPress={() => console.log('Animated Test clicked')} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  topBar: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    paddingTop: Spacing.three,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  title: {
    color: COLORS.text,
    fontFamily: FONT,
    fontWeight: '400',
    fontSize: 104,
    lineHeight: 120,
    textAlign: 'center',
  },
  buttonStack: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 50,
    paddingBottom: Spacing.four,
  },
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: COLORS.buttonPressed,
  },
  buttonLarge: {
    width: '100%',
    maxWidth: 488,
    height: 122,
  },
  buttonSmall: {
    width: 236,
    height: 77,
  },
  buttonText: {
    color: COLORS.text,
    fontFamily: FONT,
    fontWeight: '400',
  },
  buttonTextLarge: {
    fontSize: 52,
    lineHeight: 62,
  },
  buttonTextSmall: {
    fontSize: 40,
    lineHeight: 48,
  },
});