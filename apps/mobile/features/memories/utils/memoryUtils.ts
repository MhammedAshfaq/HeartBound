export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export function isValidDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day &&
    parsed <= today
  );
}

export function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function validateMemoryStep(step: number, values: {
  mediaUri: string | null;
  title: string;
  date: string;
}) {
  const errors: { title?: string; date?: string } = {};

  if (step === 1) {
    return { ok: !!values.mediaUri, errors };
  }

  if (step === 2) {
    const titleOk = values.title.trim().length > 0;
    const dateOk = values.date.length === 0 || isValidDate(values.date);
    if (!titleOk) errors.title = 'titleRequired';
    if (values.date.length > 0 && !dateOk) errors.date = 'dateFuture';
    return { ok: titleOk && dateOk, errors };
  }

  return { ok: true, errors };
}
