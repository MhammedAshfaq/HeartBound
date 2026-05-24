import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '@utils/theme';
import { OTP_LENGTH, OTP_RESEND_TIMEOUT } from '@utils/constants';

interface OTPInputProps {
  onSubmit: (otp: string) => void;
  onResend: () => void;
  loading?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ onSubmit, onResend, loading = false }) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    const otpValue = newOtp.join('');
    if (otpValue.length === OTP_LENGTH) {
      onSubmit(otpValue);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(OTP_RESEND_TIMEOUT);
    setCanResend(false);
    onResend();
    inputs.current[0]?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP</Text>
      <View style={styles.inputsContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => { inputs.current[index] = el; }}
            style={[styles.input, styles.inputText]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>Resend in {timer}s</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  input: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  inputText: {
    fontSize: 24,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  timerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
