import { Group, Code, ScrollArea, Title, Button } from '@mantine/core';
import {
  IconNotes,
  IconCalendarStats,
  IconPresentationAnalytics,
  IconAdjustments,
  IconHome,
  IconSearch
} from '@tabler/icons-react';
//import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from './NavbarLinksGroup';
//import { Logo } from './Logo';
import classes from './NavbarNested.module.css';

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
  },
  {
    label: 'Kalendar',
    icon: IconCalendarStats,
    links: [
      { label: 'Nadolazeći događaji', link: '/' },
      { label: 'Prošli događaji', link: '/' }
    ],
  },
  { label: 'Analiza', icon: IconPresentationAnalytics },
  {
    label: 'Ostavi komentar',
    icon: IconNotes
  },
  { label: 'Postavke', icon: IconAdjustments }
];

export function NavbarNested() {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Title> SportLink </Title>
          {/* <Logo style={{ width: rem(120) }} /> */}
          <Code fw={700}>v0.1.0</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
          <Button variant="default">Prijava</Button>
          <Button>Registracija</Button>
      </div>
    </nav>
  );
}