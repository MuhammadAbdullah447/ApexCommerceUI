import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../utils/validation';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
  colors?: ColorScheme;
}

const ForgotPasswordScreen = ({ navigation, colors = COLORS }: ForgotPasswordScreenProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    // Navigate to OTP verification and pass the email
    navigation.navigate('OTPVerification', { email: data.email });
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Reset Password"
        showBackButton
        onBackPress={() => navigation.goBack()}
        showBell={false}
        colors={colors}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brandHeader}>
              <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>Forgot Password?</Text>
              <Text style={[styles.welcomeSubtitle, { color: colors.onSurfaceVariant }]}>
                Enter your registered email address and we'll send you a 4-digit code to verify your identity.
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
              {/* Email Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Email Address</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderColor: errors.email ? colors.error : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Icon name="mail-outline" size={20} color={colors.outline} style={styles.inputIcon} />
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="name@company.com"
                        placeholderTextColor={colors.outline}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { color: colors.onSurface }]}
                      />
                    </View>
                  )}
                />
                {errors.email && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.email.message}</Text>
                )}
              </View>

              <Button
                label="Send Verification Code"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                colors={colors}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.xl,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    lineHeight: 22,
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  fieldGroup: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
    paddingHorizontal: SPACING.xs,
  },
  inputWrapper: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  inputIcon: {},
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: SPACING.xs,
  },
});

export default ForgotPasswordScreen;
