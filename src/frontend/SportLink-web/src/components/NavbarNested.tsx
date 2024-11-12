import { Group, ScrollArea, Title, Button, Image } from '@mantine/core';
import {
  // IconNotes,
  // IconCalendarStats,
  // IconPresentationAnalytics,
  // IconAdjustments,
  IconHome,
  IconSearch
} from '@tabler/icons-react';
//import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from './NavbarLinksGroup';
//import { Logo } from './Logo';
import classes from './NavbarNested.module.css';
import duckImage from '../assets/duck.jpg';
import { useNavigate } from 'react-router-dom';
import AuthorizedElement from './AuthorizedElement';
import UnauthorizedElement from './UnauthorizedElement';
import { UserRole } from '../types/roles';

const mockdata = [
  { label: 'Početna', icon: IconHome },
  {
    label: 'Pretraživanje',
    icon: IconSearch,
    initiallyOpened: false,
    links: [
      { label: 'Organizacije', link: '/' },
      { label: 'Događanja', link: '/' },
      { label: 'Termini', link: '/' },
    ],
   } 
   //ovo ce biti vidljivo tek kada se korisnik ulogira
  // ,{
  //   label: 'Kalendar',
  //   icon: IconCalendarStats,
  //   links: [
  //     { label: 'Nadolazeći događaji', link: '/' },
  //     { label: 'Prošli događaji', link: '/' }
  //   ],
  // },
  // { label: 'Analiza', icon: IconPresentationAnalytics },
  // {
  //   label: 'Ostavi komentar',
  //   icon: IconNotes
  // },
  // { label: 'Postavke', icon: IconAdjustments }
];

export function NavbarNested() {
  const navigate = useNavigate();
  const navigateLogin = () => { navigate('./login') };
  const navigateRegistration = () => { navigate('./registration') };

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-around">
          <div className={classes.logoContainer} >
          <Image src={duckImage} alt="duck"></Image>
          </div>
          <Title> SportLink </Title>
          {/* <Logo style={{ width: rem(120) }} /> */}
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
      <AuthorizedElement roles={[UserRole.User]}>
        {({ userData }) => 
          <p>VISIBLE TO USER ROLE ONLY</p>
        }
      </AuthorizedElement>
      <AuthorizedElement roles={[UserRole.User, UserRole.AppAdmin]}>
        {({ userData }) => 
          <p>VISIBLE TO BOTH USER AND APPADMIN ROLES</p>
        }
      </AuthorizedElement>
      <AuthorizedElement roles={[UserRole.AppAdmin]}>
        {({ userData }) => 
          <p>VISIBLE TO APPADMIN ROLE ONLY</p>
        }
      </AuthorizedElement>
      
      <div className={classes.footer}>
        <AuthorizedElement>
          {({ userData }) => (
            <>
              <div>
                <h2>Welcome, {userData.firstName} {userData.lastName}!</h2>
                <p>Your email: {userData.email}</p>
                <p>Your role: {userData.role}</p>
                <p>Your ID: {userData.id}</p>
                <a href='/logout'>LOGOUT</a>
              </div>
            </>
          )}
          {/* <UserButton/> */}
        </AuthorizedElement>
        <UnauthorizedElement>
          <Button variant='outline' size='sm' radius='sm'
            onClick={navigateLogin}
            >Prijava</Button>
          <Button variant='light' size='sm' radius='sm'  onClick={navigateRegistration}>Registracija</Button>
        </UnauthorizedElement>
          
      </div>
    </nav>
  );
}