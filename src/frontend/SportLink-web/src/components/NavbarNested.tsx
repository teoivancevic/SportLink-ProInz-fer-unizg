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

      <div className={classes.footer}>
          <Button variant='outline' size='sm' radius='sm'
          // onClick={}
          >Prijava</Button>
          <Button variant='light' size='sm' radius='sm'>Registracija</Button>
      </div>
    </nav>
  );
}