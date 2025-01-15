import {
Group,
Button,
Divider,
Box,
Burger,
Drawer,
ScrollArea,
rem
} from '@mantine/core';
// import { SportLinkLogo } from '';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';


export function Header() {
const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);


return (
    <Box pb={120}>
    <header className={classes.header}>
        <Group justify="space-between" h="100%">
        {/* <SportLinkLogo size={30} /> */}

        <Group h="100%" gap={0} visibleFrom="sm">
            <a href="#" className={classes.link}>
            Početna
            </a>
            <a href="#" className={classes.link}>
            Organizacije
            </a>
            <a href="#" className={classes.link}>
            Događanja
            </a>
            <a href="#" className={classes.link}>
            Termini
            </a>
        </Group>

        <Group>
            <Button variant="default">Prijava</Button>
            <Button>Registracija</Button>
        </Group>

        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
    </header>

    <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
    >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        <Divider my="sm" />

        <a href="#" className={classes.link}>
            Početna
        </a>
        <a href="#" className={classes.link}>
            Organizacije
        </a>
        <a href="#" className={classes.link}>
            Događanja
        </a>
        <a href="#" className={classes.link}>
            Termini
        </a>

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
        </Group>
        </ScrollArea>
    </Drawer>
    </Box>
);
}
