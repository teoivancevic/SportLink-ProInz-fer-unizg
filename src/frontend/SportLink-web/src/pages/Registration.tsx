import { useParams } from 'react-router-dom';
import { RegistrationBox } from '../components/authentication/RegistrationBox.tsx';
import { VerificationBox } from '../components/authentication/VerificationBox.tsx';
import { RegistrationEndBox } from '../components/authentication/RegistrationEndBox.tsx';

export function Registration() {
  const { step } = useParams();

  // Render different components based on the route
  switch (step) {
    case 'otp':
      return <VerificationBox />;
    case 'success':
      return <RegistrationEndBox />;
    default:
      return <RegistrationBox />;
  }
}