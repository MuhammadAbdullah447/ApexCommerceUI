import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BrandIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, STATUSBAR_HEIGHT, ColorScheme } from '../constants/theme';


interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSignUpPress?: () => void;
  colors?: ColorScheme;
}


const LoginScreen = ({ onLoginSuccess, onSignUpPress, colors = COLORS }: LoginScreenProps) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLoginPress = () => {
    if (!validateForm()) return;
    onLoginSuccess();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: emailError ? colors.error : colors.outlineVariant,
                },
              ]}
            >
              <Icon name="mail-outline" size={20} color={colors.outline} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholder="name@company.com"
                placeholderTextColor={colors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: colors.onSurface }]}
              />
            </View>
            {emailError ? <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text> : null}
          </View>

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>Password</Text>
              <Pressable>
                <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot Password?</Text>
              </Pressable>
            </View>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: passwordError ? colors.error : colors.outlineVariant,
                },
              ]}
            >
              <Icon name="lock-outline" size={20} color={colors.outline} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
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
            {passwordError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Login Button */}
          <Button
            label="Login"
            onPress={handleLoginPress}
            variant="primary"
            icon={<Icon name="arrow-forward" size={20} color={colors.onPrimary} />}
            iconPosition="right"
            colors={colors}
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
            icon={<BrandIcon name="google" size={20} color={colors.onSurface} />}
            iconPosition="left"
            colors={colors}
          />
          <View style={{ height: SPACING.md }} />
          <Button
            label="Apple"
            onPress={() => {}}
            variant="dark"
            icon={<BrandIcon name="apple" size={20} color={colors.white} />}
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
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
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
});

export default LoginScreen;