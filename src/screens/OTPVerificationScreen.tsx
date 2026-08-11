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
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OTPFormValues } from '../utils/validation';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;

interface OTPVerificationScreenProps {
  navigation: OTPVerificationScreenNavigationProp;
  route: OTPVerificationScreenRouteProp;
  colors?: ColorScheme;
}

const OTPVerificationScreen = ({ navigation, route, colors = COLORS }: OTPVerificationScreenProps) => {
  const email = route.params?.email || 'your email';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = (data: OTPFormValues) => {
    Alert.alert('Verification Successful', 'Your identity has been verified. You can now login with your account.', [
      { text: 'OK', onPress: () => navigation.replace('Login') }
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Verify Code"
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
              <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>Enter OTP Code</Text>
              <Text style={[styles.welcomeSubtitle, { color: colors.onSurfaceVariant }]}>
                We have sent a 4-digit verification code to <Text style={styles.emailText}>{email}</Text>
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
              {/* OTP Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Verification Code</Text>
                <Controller
                  control={control}
                  name="code"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderColor: errors.code ? colors.error : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Icon name="sms" size={20} color={colors.outline} style={styles.inputIcon} />
                      <View style={styles.inputContainer}>
                        <Text style={[styles.displayText, { color: colors.onSurface }]} pointerEvents="none">
                          {value}
                          <Text style={{ color: colors.outline }}>
                            {'0000'.slice(value ? value.length : 0)}
                          </Text>
                        </Text>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          keyboardType="number-pad"
                          maxLength={4}
                          style={[
                            styles.realInput,
                            {
                              color: 'transparent',
                            },
                          ]}
                          selectionColor={colors.primary}
                        />
                      </View>
                    </View>
                  )}
                />
                {errors.code && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.code.message}</Text>
                )}
              </View>

              <Button
                label="Verify & Proceed"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                colors={colors}
              />
            </View>

            {/* Resend Action */}
            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: colors.onSurfaceVariant }]}>
                Didn't receive the code?{' '}
                <Text style={[styles.resendLink, { color: colors.primary }]} onPress={() => Alert.alert('Code Resent', `A new verification code was sent to ${email}`)}>
                  Resend Code
                </Text>
              </Text>
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
  emailText: {
    fontWeight: '700',
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
  inputContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  displayText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 16,
    width: 130,
    textAlign: 'left',
    padding: 0,
    includeFontPadding: false,
  },
  realInput: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 16,
    width: 130,
    height: '100%',
    textAlign: 'left',
    padding: 0,
    includeFontPadding: false,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: SPACING.xs,
  },
  resendContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  resendText: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
  },
  resendLink: {
    fontWeight: '700',
  },
});

export default OTPVerificationScreen;
