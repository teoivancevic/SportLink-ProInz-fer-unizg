import { useParams } from 'react-router-dom';
import { RegistrationBox } from '../components/RegistrationBox.tsx';
import { VerificationBox } from '../components/VerificationBox.tsx';
import { RegistrationEndBox } from '../components/RegistrationEndBox.tsx';

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