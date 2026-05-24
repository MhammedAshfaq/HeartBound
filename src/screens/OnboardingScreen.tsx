import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { personalDetailsSchema, relationshipDetailsSchema } from '@utils/validation';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { Loading } from '@components/common/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { theme } from '@utils/theme';
import { GENDER_OPTIONS, RELATIONSHIP_TYPES } from '@utils/constants';
import { Gender, RelationshipType } from '../types';

type Step = 1 | 2 | 3;

interface PersonalDetailsForm {
  name: string;
  age: number;
  gender: string;
}

interface RelationshipDetailsForm {
  relationshipType: string;
  anniversary: Date;
}

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { updateProfile, completeOnboarding } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const personalForm = useForm<PersonalDetailsForm>({
    resolver: yupResolver(personalDetailsSchema),
    defaultValues: { name: '', age: 18, gender: '' },
  });

  const relationshipForm = useForm<RelationshipDetailsForm>({
    resolver: yupResolver(relationshipDetailsSchema),
    defaultValues: { relationshipType: '', anniversary: new Date() },
  });

  const handlePersonalSubmit = async (data: PersonalDetailsForm) => {
    try {
      setLoading(true);
      await updateProfile({
        name: data.name,
        age: data.age,
        gender: data.gender as Gender,
      });
      setStep(2);
    } catch (error) {
      console.error('Personal details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelationshipSubmit = async (data: RelationshipDetailsForm) => {
    try {
      setLoading(true);
      setStep(3);
    } catch (error) {
      console.error('Relationship details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Quiz' }],
      })
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((s) => (
        <View
          key={s}
          style={[
            styles.stepDot,
            s <= step && styles.stepDotActive,
          ]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.form}>
      <Controller
        control={personalForm.control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Name"
            placeholder="Enter your name"
            value={value}
            onChangeText={onChange}
            error={personalForm.formState.errors.name?.message}
          />
        )}
      />

      <Controller
        control={personalForm.control}
        name="age"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Age"
            placeholder="Enter your age"
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(text ? parseInt(text) : 0)}
            error={personalForm.formState.errors.age?.message}
            keyboardType="number-pad"
          />
        )}
      />

      <View style={styles.genderContainer}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderOptions}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderOption,
                personalForm.watch('gender') === option.value &&
                  styles.genderOptionSelected,
              ]}
              onPress={() => personalForm.setValue('gender', option.value)}
            >
              <Text
                style={[
                  styles.genderOptionText,
                  personalForm.watch('gender') === option.value &&
                    styles.genderOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {personalForm.formState.errors.gender && (
          <Text style={styles.errorText}>
            {personalForm.formState.errors.gender.message}
          </Text>
        )}
      </View>

      <Button
        title="Next"
        onPress={personalForm.handleSubmit(handlePersonalSubmit)}
        style={styles.button}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.form}>
      <View style={styles.relationshipTypeContainer}>
        <Text style={styles.label}>Relationship Type</Text>
        <View style={styles.relationshipOptions}>
          {RELATIONSHIP_TYPES.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.relationshipOption,
                relationshipForm.watch('relationshipType') === option.value &&
                  styles.relationshipOptionSelected,
              ]}
              onPress={() =>
                relationshipForm.setValue('relationshipType', option.value)
              }
            >
              <Text
                style={[
                  styles.relationshipOptionText,
                  relationshipForm.watch('relationshipType') === option.value &&
                    styles.relationshipOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {relationshipForm.formState.errors.relationshipType && (
          <Text style={styles.errorText}>
            {relationshipForm.formState.errors.relationshipType.message}
          </Text>
        )}
      </View>

      <Controller
        control={relationshipForm.control}
        name="anniversary"
        render={({ field: { onChange, value } }) => (
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Anniversary Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {value ? value.toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setSelectedDate(date);
                    onChange(date);
                  }
                }}
              />
            )}
          </View>
        )}
      />

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={() => setStep(1)}
          variant="outline"
          style={styles.buttonHalf}
        />
        <Button
          title="Next"
          onPress={relationshipForm.handleSubmit(handleRelationshipSubmit)}
          style={styles.buttonHalf}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.form}>
      <Text style={styles.stepTitle}>Invite Your Partner</Text>
      <Text style={styles.stepDescription}>
        Share your invite code with your partner to sync your relationship
      </Text>

      <View style={styles.inviteCodeContainer}>
        <Text style={styles.inviteCode}>ABCD1234</Text>
        <Button
          title="Copy Code"
          onPress={() => {}}
          variant="outline"
          style={styles.copyButton}
        />
      </View>

      <Button
        title="Share Invite"
        onPress={() => {}}
        style={styles.button}
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <Input
        label="Enter Partner's Code"
        placeholder="Enter 8-character code"
      />

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={() => setStep(2)}
          variant="outline"
          style={styles.buttonHalf}
        />
        <Button
          title="Complete"
          onPress={handleComplete}
          style={styles.buttonHalf}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderStepIndicator()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        <Loading visible={loading} message="Saving..." />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
  },
  form: {
    gap: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  genderContainer: {
    marginBottom: theme.spacing.md,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  genderOption: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  genderOptionText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  genderOptionTextSelected: {
    color: theme.colors.primary,
  },
  relationshipTypeContainer: {
    marginBottom: theme.spacing.md,
  },
  relationshipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  relationshipOption: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  relationshipOptionSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  relationshipOptionText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  relationshipOptionTextSelected: {
    color: theme.colors.primary,
  },
  dateContainer: {
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  buttonHalf: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  stepDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  inviteCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  copyButton: {
    minWidth: 100,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
