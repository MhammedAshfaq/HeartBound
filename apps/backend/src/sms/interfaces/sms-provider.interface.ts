export interface SmsProvider {
  readonly name: string;
  sendSms(to: string, body: string): Promise<boolean>;
}
