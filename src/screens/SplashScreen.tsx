import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, ColorScheme } from '../constants/theme';


interface SplashScreenProps {
  onFinish: () => void;
  colors?: ColorScheme;
}


const LOGO_BLUE = '#3B82F6';


const SplashScreen = ({ onFinish, colors = COLORS }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>

        <View style={styles.logoWrapper}>
          <View style={styles.triangleOuter} />
          <View style={styles.triangleHole} />
          <View style={styles.triangleInner} />
        </View>

        {/* Branding text */}
        <View style={styles.brandTextBlock}>
          <Text style={[styles.apexText, { color: colors.onSurface }]}>APEX</Text>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      </View>

      {/* Footer dots — static (no pulse animation, see note above) */}
      <View style={styles.footerDots}>
        <View style={[styles.dot, { opacity: 0.4 }]} />
        <View style={[styles.dot, { opacity: 0.6 }]} />
        <View style={[styles.dot, { opacity: 0.4 }]} />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  triangleOuter: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 34,
    borderRightWidth: 34,
    borderBottomWidth: 58,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: LOGO_BLUE,
  },

  triangleHole: {
    position: 'absolute',
    top: 23,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 24,
    borderRightWidth: 24,
    borderBottomWidth: 42,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.background,
  },

  triangleInner: {
    position: 'absolute',
    top: 34,
    left: 29,
    width: 0,
    height: 0,
    borderLeftWidth: 19,
    borderRightWidth: 19,
    borderBottomWidth: 34,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: LOGO_BLUE,
  },
  brandTextBlock: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  apexText: {
    fontSize: 30,
    fontWeight: '300',
    letterSpacing: 6,
  },
  premiumText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 7,
    color: LOGO_BLUE,
  },
  footerDots: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: LOGO_BLUE,
  },
});

export default SplashScreen;