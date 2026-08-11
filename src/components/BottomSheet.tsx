import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  colors?: ColorScheme;
}

const BottomSheet = ({
  visible,
  title,
  onClose,
  children,
  colors = COLORS,
}: BottomSheetProps) => {
  const [slideAnim] = useState(() => new Animated.Value(SCREEN_HEIGHT));
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [showModal, setShowModal] = useState(visible);
  const insets = useSafeAreaInsets();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Set pan responder on vertical drag down
        return gestureState.dy > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, slideAnim, backdropOpacity]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable style={styles.backdropPressable} onPress={handleClose} />
        </Animated.View>

        {/* Content Wrapper */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ translateY: slideAnim }],
              backgroundColor: colors.surfaceContainerLowest,
              paddingBottom: insets.bottom + SPACING.md,
            },
          ]}
        >
          {/* Header handle */}
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />
          </View>

          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text style={[styles.titleText, { color: colors.onSurface }]}>{title}</Text>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Icon name="close" size={24} color={colors.outline} />
            </Pressable>
          </View>

          {/* Child content */}
          <View style={styles.childrenWrapper}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  backdropPressable: {
    flex: 1,
  },
  contentContainer: {
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  titleText: {
    fontSize: TYPOGRAPHY.sectionTitle.fontSize - 4,
    fontWeight: '700',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  childrenWrapper: {
    paddingHorizontal: SPACING.lg,
  },
});

export default BottomSheet;
