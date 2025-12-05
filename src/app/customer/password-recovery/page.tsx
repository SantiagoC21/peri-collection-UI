import { redirect } from 'next/navigation';

export default function PasswordRecoveryPage() {
  redirect('/auth/password-recovery');
  return null;
}
