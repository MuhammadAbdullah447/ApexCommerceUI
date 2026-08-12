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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BrandIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../utils/validation';
import Button from '../components/Button';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ColorScheme } from '../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { UserProfile } from '../types/auth';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { getAuthErrorMessage } from '../services/api/authApi';
import { saveSecureItem } from '../services/storage/secureStore';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  onLoginSuccess: (user: UserProfile) => void;
  onSignUpPress?: () => void;
  colors?: ColorScheme;
}

const LoginScreen = ({
  navigation,
  onLoginSuccess,
  onSignUpPress,
  colors = COLORS,
}: LoginScreenProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (loginMutation.isPending) return;
    setApiError(null);
    loginMutation.mutate(
      {
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: async (responseData) => {
          await saveSecureItem('auth_access_token', responseData.accessToken);
          const user: UserProfile = {
            id: responseData.id,
            username: responseData.username,
            email: responseData.email,
            firstName: responseData.firstName,
            lastName: responseData.lastName,
            gender: responseData.gender,
            image: responseData.image,
            accessToken: responseData.accessToken,
            token: responseData.accessToken,
          };
          onLoginSuccess(user);
        },
        onError: (error) => {
          setApiError(getAuthErrorMessage(error));
        },
      }
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Brand Header */}
            <View style={styles.heroSection}>
              <View style={styles.bagIconWrapper}>
                <Icon name="shopping-bag" size={48} color={colors.primary} />
              </View>
              <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>Welcome back</Text>
              <Text style={[styles.welcomeSubtitle, { color: colors.onSurfaceVariant }]}>
                Elevate your shopping experience with Apex Premium.
              </Text>
            </View>

            {/* Login Form Card */}
            <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
              
              {/* API Error Message */}
              {apiError && (
                <View style={[styles.apiErrorWrapper, { backgroundColor: colors.errorContainer, borderColor: colors.error }]}>
                  <Icon name="error-outline" size={20} color={colors.error} />
                  <Text style={[styles.apiErrorText, { color: colors.onErrorContainer }]}>{apiError}</Text>
                </View>
              )}

              {/* Username/Email Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Username or Email</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        {
                          backgroundColor: colors.surfaceContainerLow,
                          borderColor: errors.username ? colors.error : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Icon name="person-outline" size={20} color={colors.outline} style={styles.inputIcon} />
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter your username or email"
                        placeholderTextColor={colors.outline}
                        keyboardType="default"
                        autoCapitalize="none"
                        style={[styles.input, { color: colors.onSurface }]}
                      />
                    </View>
                  )}
                />
                {errors.username && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.username.message}</Text>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.fieldGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Password</Text>
                  <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot Password?</Text>
                  </Pressable>
                </View>
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

              {/* Login Button */}
              <Button
                label="Login"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                icon={<Icon name="arrow-forward" size={20} color={colors.onPrimary} />}
                iconPosition="right"
                colors={colors}
                loading={loginMutation.isPending}
              />

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />
                <Text style={[styles.dividerText, { color: colors.outline }]}>or continue with</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />
              </View>

              {/* Social Logins */}
              <Button
                label="Google"
                onPress={() => {}}
                variant="outline"
                icon={
                  <Image
                    source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                    style={styles.googleIcon}
                  />
                }
                iconPosition="left"
                colors={colors}
              />
              <View style={{ height: SPACING.xs }} />
              <Button
                label="Apple"
                onPress={() => {}}
                variant="dark"
                icon={
                  <BrandIcon
                    name="apple"
                    size={20}
                    color={colors.background === '#10131a' ? colors.background : colors.white}
                  />
                }
                iconPosition="left"
                colors={colors}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
                Don't have an account?{' '}
                <Text style={[styles.signUpLink, { color: colors.primary }]} onPress={onSignUpPress}>
                  Sign Up
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
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  bagIconWrapper: {
    marginBottom: SPACING.md,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
    textAlign: 'center',
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: SPACING.xs,
  },
  fieldGroup: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
    paddingHorizontal: SPACING.xs,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  forgotPassword: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
    fontWeight: '600',
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.bodyMain.fontSize,
  },
  signUpLink: {
    fontWeight: '700',
  },
  apiErrorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  apiErrorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
});

export default LoginScreen;