import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, ColorScheme } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNotifications } from '../context/NotificationContext';


interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onBellPress?: () => void;
  showBell?: boolean;
  onSharePress?: () => void;
  avatarUri?: string;
  onAvatarPress?: () => void;
  colors?: ColorScheme;
}


const Header = ({
  title,
  showBackButton = false,
  onBackPress,
  onBellPress,
  showBell = true,
  onSharePress,
  avatarUri,
  onAvatarPress,
  colors = COLORS,
}: HeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { unreadCount } = useNotifications();

  const handleBellPress = onBellPress || (() => navigation.navigate('Notifications'));

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainerLowest }]}>
      {/* CENTER: screen/brand title, rendered first to sit behind left/right sections in z-order */}
      <Text style={[styles.title, { color: colors.primary }]} numberOfLines={1}>
        {title}
      </Text>

      {/* LEFT SIDE: back button, OR avatar+greeting (if provided), OR brand logo mark */}
      <View style={styles.leftSection}>
        {showBackButton ? (
          <Pressable style={styles.iconButton} onPress={onBackPress}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
        ) : avatarUri ? (
          <Pressable onPress={onAvatarPress}>
            <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: colors.outlineVariant }]} resizeMode="cover" />
          </Pressable>
        ) : (
          <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoLetter, { color: colors.onPrimary }]}>A</Text>
          </View>
        )}
      </View>

      {/* RIGHT SIDE: optional share icon + bell icon */}
      <View style={styles.rightSection}>
        {onSharePress && (
          <Pressable style={styles.iconButton} onPress={onSharePress}>
            <Icon name="share" size={22} color={colors.primary} />
          </Pressable>
        )}
        {showBell ? (
          <Pressable style={styles.iconButton} onPress={handleBellPress}>
            <View style={{ position: 'relative' }}>
              <Icon name="notifications-none" size={24} color={colors.primary} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '35%',
    flexShrink: 1,
  },
  rightSection: {
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
    flexShrink: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  greetingColumn: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  greetingLabel: {
    fontSize: 12,
  },
  greetingName: {
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
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
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default Header;