import { ScrollArea, Button, Image} from '@mantine/core';
import {
  IconNotes,
  IconAdjustments,
  IconHome,
  IconSearch,
  IconList
} from '@tabler/icons-react';
import { LinksGroup } from './NavbarLinksGroup';
//import { Logo } from './Logo';
import classes from './NavbarNested.module.css';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import AuthorizedElement from './authorization/AuthorizedElement';
import UnauthorizedElement from './authorization/UnauthorizedElement';
import { UserRole } from '../types/roles';
import { UserButton } from './UserButton';

const unauthorizedMockdata = [
  { label: 'Početna', icon: IconHome, link: '/lajhsbd' },
  {
    label: 'Pretraživanje',
    icon: IconSearch,
    links: [
      { label: 'Organizacije', link: '/' },
      { label: 'Događanja', link: '/' },
      { label: 'Termini', link: '/' },
    ],
  }
];

const authorizedExtraMockdata = [
  ...unauthorizedMockdata,
  {
    label: 'Ostavi komentar',
    icon: IconNotes
  },
  { label: 'Postavke', icon: IconAdjustments }
];


const appAdminExtraMockdata = [
  ...authorizedExtraMockdata,
  {label: "Admin organizacije", icon: IconList, 
    links: [
      { label: 'Nepotrvđene', link: '/adminOrganizations' }
    ],
  }
];



export function NavbarNested() {
  const navigate = useNavigate();
  const navigateLogin = () => { navigate('/login') };
  const navigateRegistration = () => { navigate('/registration') };
  const navigateCreateOrganization = () => { navigate('/registerOrganisation') };

  const unauthorizedLinks = unauthorizedMockdata.map((item) => <LinksGroup {...item} key={item.label} />);
  
  const authorizedLinks = authorizedExtraMockdata.map((item) => <LinksGroup {...item} key={item.label} />);
  const appAdminLinks = appAdminExtraMockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
          <Image src={logo} alt="sportlink"></Image>
      </div>

      <ScrollArea className={classes.links}>
        
        <UnauthorizedElement>
          <div className={classes.linksInner}>{unauthorizedLinks}</div>
        </UnauthorizedElement>
        <AuthorizedElement roles={[UserRole.User, UserRole.OrganizationOwner]}>
          {() => 
            <div className={classes.linksInner}>{authorizedLinks}</div>
          }
        </AuthorizedElement>
        <AuthorizedElement roles={[UserRole.AppAdmin]}>
          {() => 
            <div className={classes.linksInner}>{appAdminLinks}</div>
          }
        </AuthorizedElement>
        
      </ScrollArea>

      {/* <AuthorizedElement roles={[UserRole.User]}>
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
      </AuthorizedElement> */}


      <AuthorizedElement roles={[UserRole.User]}>
        {() => 
          <Button variant="light" size="sm" radius="sm" onClick={navigateCreateOrganization}>
            Kreiraj organizaciju
          </Button>
        }
      </AuthorizedElement>
      <div className={classes.footer}>
        <AuthorizedElement roles={[UserRole.User, UserRole.OrganizationOwner, UserRole.AppAdmin]}>
          {({ userData }) => (
          <UserButton name={userData.firstName + ' ' + userData.lastName} email={userData.email} onLogout={() => { navigate('/logout')}} />
          )}
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