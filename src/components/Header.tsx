import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, ColorScheme } from '../constants/theme';


interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onBellPress?: () => void;
  onSharePress?: () => void;
  avatarUri?: string;
  userName?: string;
  colors?: ColorScheme;
}


const Header = ({
  title,
  showBackButton = false,
  onBackPress,
  onBellPress,
  onSharePress,
  avatarUri,
  userName,
  colors = COLORS,
}: HeaderProps) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerLowest }]}>
      {/* LEFT SIDE: back button, OR avatar+greeting (if provided), OR brand logo mark */}
      <View style={styles.leftSection}>
        {showBackButton ? (
          <Pressable style={styles.iconButton} onPress={onBackPress}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
        ) : avatarUri ? (
          <View style={styles.avatarRow}>
            <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: colors.outlineVariant }]} resizeMode="cover" />
            {userName && (
              <View style={styles.greetingColumn}>
                <Text style={[styles.greetingLabel, { color: colors.onSurfaceVariant }]}>Hello,</Text>
                <Text style={[styles.greetingName, { color: colors.onSurface }]}>{userName}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoLetter, { color: colors.onPrimary }]}>A</Text>
          </View>
        )}
      </View>

      {/* CENTER: screen/brand title, always centered regardless of variant */}
      <Text style={[styles.title, { color: colors.primary }]} numberOfLines={1}>
        {title}
      </Text>

      {/* RIGHT SIDE: optional share icon + bell icon */}
      <View style={styles.rightSection}>
        {onSharePress && (
          <Pressable style={styles.iconButton} onPress={onSharePress}>
            <Icon name="share" size={22} color={colors.primary} />
          </Pressable>
        )}
        <Pressable style={styles.iconButton} onPress={onBellPress}>
          <Icon name="notifications-none" size={24} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    height: 64,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.marginMobile,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.xs,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 16,
    fontWeight: '800',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  greetingColumn: {
    flexDirection: 'column',
  },
  greetingLabel: {
    fontSize: 12,
  },
  greetingName: {
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    flex: 2,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;