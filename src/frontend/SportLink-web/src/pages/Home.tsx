// import { useGetData } from '../services/api';
//import { LoginBox } from '../components/LoginBox.tsx';
import { OrganisationReg } from '../components/OrganisationReg.tsx';
import './Home.css';
import { Center } from '@mantine/core';
//import {VerificationBox} from '../components/VerificationBox.tsx'

// interface DogApiResponse {
//   message: string;  // image URL
//   status: string;
// }

export function Home() {
return <Center h="100vh" w="100vw">
     <OrganisationReg/>
</Center>

}