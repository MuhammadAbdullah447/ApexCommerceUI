import React from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import BottomNavBar, { NavTab } from '../components/BottomNavBar';
import { COLORS, SPACING, RADIUS, STATUSBAR_HEIGHT, ColorScheme } from '../constants/theme';


interface ProfileScreenProps {
  onTabPress: (tab: NavTab) => void;
  onLogoutPress: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  colors?: ColorScheme;
}

interface MenuItem {
  key: string;
  label: string;
  icon: string;
}


const ORDER_GROUP: MenuItem[] = [
  { key: 'orders', label: 'Order History', icon: 'inventory-2' },
  { key: 'wishlist', label: 'Wishlist', icon: 'favorite' },
];

const ACCOUNT_GROUP: MenuItem[] = [
  { key: 'addresses', label: 'Saved Addresses', icon: 'location-on' },
  { key: 'payments', label: 'Payment Methods', icon: 'payments' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications-active' },
];


const ProfileScreen = ({
  onTabPress,
  onLogoutPress,
  isDarkMode,
  onToggleDarkMode,
  colors = COLORS,
}: ProfileScreenProps) => {

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Apex Premium" onBellPress={() => {}} colors={colors} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdSk4SDTB8YFDi8rSYqvPko1H10Tp6HEX4Qguv_ZJS8HkTujZeDsxArxDh-QVBE1bfQCKLKDAYFula7fjzH7G-KDm8n_u5hwcHKzMDtUVHYcdt7J74rtiPLOR_sjgDCnqxnsifit08Kdzrx296n2YywWvILGuxjigrQfRPLQ7pcsayM6cljjAmvNWsuNcA41ldfpr8SZwUCaZaUGrlPPpBFNgPmU-2fY1oFlmq4dij_TmKAlN4JUXvxZO872eeebU2F8v4JIV1M0U',
              }}
              style={styles.avatar}
            />
            <Pressable style={[styles.editButton, { backgroundColor: colors.primary, borderColor: colors.background }]}>
              <Icon name="edit" size={16} color={colors.white} />
            </Pressable>
          </View>
          <Text style={[styles.name, { color: colors.onSurface }]}>Alexander Sterling</Text>
          <Text style={[styles.email, { color: colors.onSurfaceVariant }]}>
            alexander.sterling@premium.com
          </Text>
        </View>

        {/* Order & Wishlist Group */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
          {ORDER_GROUP.map((item) => (
            <MenuRow key={item.key} label={item.label} icon={item.icon} colors={colors} />
          ))}
        </View>

        {/* Account Details Group */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
          {ACCOUNT_GROUP.map((item) => (
            <MenuRow key={item.key} label={item.label} icon={item.icon} colors={colors} />
          ))}
        </View>

        {/* Dark Mode Toggle */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
          <View style={styles.toggleRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBadge, styles.iconBadgeAmber]}>
                <Icon name="dark-mode" size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.onSurface }]}>Dark Mode</Text>
            </View>

            <Pressable
              onPress={onToggleDarkMode}
              style={[
                styles.toggleTrack,
                { backgroundColor: isDarkMode ? colors.primary : colors.outlineVariant },
              ]}
            >
              <View style={[styles.toggleThumb, isDarkMode && styles.toggleThumbActive]} />
            </Pressable>
          </View>
        </View>

        {/* Settings & Logout */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.settingsButton, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Icon name="settings" size={18} color={colors.onSurface} />
            <Text style={[styles.settingsText, { color: colors.onSurface }]}>Settings</Text>
          </Pressable>

          <Pressable style={[styles.logoutButton, { backgroundColor: colors.errorContainer }]} onPress={onLogoutPress}>
            <Icon name="logout" size={18} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="profile" onTabPress={onTabPress} cartCount={2} colors={colors} />
    </SafeAreaView>
  );
};


const MenuRow = ({
  label,
  icon,
  colors,
}: {
  label: string;
  icon: string;
  colors: ColorScheme;
}) => {
  return (
    <Pressable style={styles.menuRow}>
      <View style={styles.rowLeft}>
        <View style={styles.iconBadge}>
          <Icon name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.rowLabel, { color: colors.onSurface }]}>{label}</Text>
      </View>
      <Icon name="chevron-right" size={22} color={colors.outlineVariant} />
    </Pressable>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.surfaceContainerHigh,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeAmber: {
    backgroundColor: 'rgba(133, 83, 0, 0.1)',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  settingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;