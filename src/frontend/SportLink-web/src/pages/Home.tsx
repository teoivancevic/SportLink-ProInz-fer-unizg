// import { useGetData } from '../services/api';
import {Button} from '@mantine/core'
import { useNavigate } from 'react-router-dom';


export function Home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login');
  };

  return <Button onClick={handleNavigate}>Go to Login</Button>;
}