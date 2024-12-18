import { NavbarNested } from "../components/NavbarNested";
import { Flex, Box, Center, ScrollArea } from "@mantine/core";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayoutWithNavbar({ children }: MainLayoutProps) {
  return(
    <Flex style={{ height: '100%'}}>
      <Box style={{ position: 'fixed',width:"300px", top: 0, left: 0, height: '100%', overflow: 'auto', zIndex:"10" }}>
        <NavbarNested />
      </Box>

      <Box style={{ flex: 1, marginLeft: "300px"}}>
        <ScrollArea style={{ height: '100%' }}>
          <Center style={{ width: '100%' }}>
            {children}
          </Center>
        </ScrollArea>
      </Box>
    </Flex>
  );
}