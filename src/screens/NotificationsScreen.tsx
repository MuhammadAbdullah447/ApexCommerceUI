import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { useNotifications, Notification } from '../context/NotificationContext';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NotificationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
  colors?: ColorScheme;
}

const getNotificationIconInfo = (type: Notification['type'], colors: ColorScheme) => {
  switch (type) {
    case 'welcome':
      return { name: 'celebration', color: colors.primary, bg: 'rgba(37, 99, 235, 0.1)' };
    case 'promotion':
      return { name: 'campaign', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    case 'wishlist':
      return { name: 'favorite', color: colors.tertiary, bg: 'rgba(190, 24, 74, 0.1)' };
    case 'offer':
      return { name: 'local-offer', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
    case 'order':
      return { name: 'local-shipping', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' };
    case 'recommendation':
    default:
      return { name: 'thumb-up', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)' };
  }
};

const NotificationsScreen = ({ navigation, colors = COLORS }: NotificationsScreenProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const insets = useSafeAreaInsets();

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const iconInfo = getNotificationIconInfo(item.type, colors);

    return (
      <Pressable
        style={[
          styles.itemCard,
          {
            backgroundColor: item.read
              ? colors.surfaceContainerLowest
              : colors.surfaceContainerLow,
            borderColor: item.read ? colors.outlineVariant : colors.primary,
          },
        ]}
        onPress={() => markAsRead(item.id)}
      >
        {/* Left Side: Icon */}
        <View style={[styles.iconContainer, { backgroundColor: iconInfo.bg }]}>
          <Icon name={iconInfo.name} size={24} color={iconInfo.color} />
        </View>

        {/* Center: Content */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.itemTitle,
                {
                  color: colors.onSurface,
                  fontWeight: item.read ? '600' : '800',
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </View>
          <Text
            style={[
              styles.itemDescription,
              { color: item.read ? colors.onSurfaceVariant : colors.onSurface },
            ]}
          >
            {item.description}
          </Text>
          <Text style={[styles.itemTime, { color: colors.outline }]}>
            {item.timestamp}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Notifications"
        showBackButton
        onBackPress={() => navigation.goBack()}
        showBell={false}
        colors={colors}
      />

      {/* Sub Header / Action Row */}
      {notifications.length > 0 && (
        <View style={[styles.actionRow, { borderBottomColor: colors.outlineVariant }]}>
          <Text style={[styles.unreadCountText, { color: colors.onSurfaceVariant }]}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'No unread notifications'}
          </Text>
          {unreadCount > 0 && (
            <Pressable onPress={markAllAsRead}>
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                Mark all as read
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconWrapper, { backgroundColor: colors.surfaceContainerLow }]}>
            <Icon name="notifications-none" size={64} color={colors.outline} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
            No notifications yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
            We'll let you know when we have updates about orders, price drops, or promotional offers.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + SPACING.md },
          ]}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  unreadCountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  itemCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontSize: 15,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  itemTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.marginMobile + 16,
    paddingBottom: 64,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sectionTitle.fontSize - 2,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationsScreen;
