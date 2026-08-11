import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
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
import { signupSchema, SignupFormValues } from '../utils/validation';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { registerMockUser } from '../services/auth';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
  colors?: ColorScheme;
}

const SignupScreen = ({ navigation, colors = COLORS }: SignupScreenProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    // Register the user credentials locally in memory
    await registerMockUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    navigation.replace('Login');
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Create Account"
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
            {/* Header branding */}
            <View style={styles.brandHeader}>
              <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>Join Apex</Text>
              <Text style={[styles.welcomeSubtitle, { color: colors.onSurfaceVariant }]}>
                Experience premium quality products and seamless shopping.
              </Text>
            </View>

            {/* Form Card */}
            <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
              
              {/* Name Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderColor: errors.name ? colors.error : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Icon name="person-outline" size={20} color={colors.outline} style={styles.inputIcon} />
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="John Doe"
                        placeholderTextColor={colors.outline}
                        style={[styles.input, { color: colors.onSurface }]}
                      />
                    </View>
                  )}
                />
                {errors.name && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.name.message}</Text>
                )}
              </View>

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

              {/* Password Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderColor: errors.password ? colors.error : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Icon name="lock-outline" size={20} color={colors.outline} style={styles.inputIcon} />
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="••••••••"
                        placeholderTextColor={colors.outline}
                        secureTextEntry={!isPasswordVisible}
                        style={[styles.input, { color: colors.onSurface }]}
                      />
                      <Pressable
                        style={styles.eyeButton}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        <Icon
                          name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                          size={20}
                          color={colors.outlineVariant}
                        />
                      </Pressable>
                    </View>
                  )}
                />
                {errors.password && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.password.message}</Text>
                )}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderColor: errors.confirmPassword ? colors.error : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Icon name="lock-outline" size={20} color={colors.outline} style={styles.inputIcon} />
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="••••••••"
                        placeholderTextColor={colors.outline}
                        secureTextEntry={!isConfirmPasswordVisible}
                        style={[styles.input, { color: colors.onSurface }]}
                      />
                      <Pressable
                        style={styles.eyeButton}
                        onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                      >
                        <Icon
                          name={isConfirmPasswordVisible ? 'visibility-off' : 'visibility'}
                          size={20}
                          color={colors.outlineVariant}
                        />
                      </Pressable>
                    </View>
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* Register Button */}
              <Button
                label="Create Account"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                colors={colors}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
                Already have an account?{' '}
                <Text style={[styles.loginLink, { color: colors.primary }]} onPress={() => navigation.navigate('Login')}>
                  Login
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
    paddingVertical: SPACING.lg,
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
  eyeButton: {
    padding: SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: SPACING.xs,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
  },
  loginLink: {
    fontWeight: '700',
  },
});

export default SignupScreen;
