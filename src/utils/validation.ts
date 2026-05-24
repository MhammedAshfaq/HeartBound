import * as yup from 'yup';
import { MIN_AGE, MAX_AGE, OTP_LENGTH } from './constants';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const phoneSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\d{4,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

export const otpSchema = yup.object({
  otp: yup
    .string()
    .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
});

export const personalDetailsSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  age: yup
    .number()
    .min(MIN_AGE, `You must be at least ${MIN_AGE} years old`)
    .max(MAX_AGE, `Age must be less than ${MAX_AGE}`)
    .required('Age is required'),
  gender: yup.string().required('Gender is required'),
});

export const relationshipDetailsSchema = yup.object({
  relationshipType: yup.string().required('Relationship type is required'),
  anniversary: yup.date().required('Anniversary date is required'),
});

export const partnerCodeSchema = yup.object({
  code: yup
    .string()
    .length(8, 'Invite code must be 8 characters')
    .required('Invite code is required'),
});

export const profileUpdateSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: yup.string().email('Invalid email'),
});
