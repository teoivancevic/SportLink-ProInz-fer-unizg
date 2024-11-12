import { NavbarNested } from "../components/NavbarNested";
import { useLocation } from "react-router-dom";
import { Text, Flex, Box, Center, ScrollArea } from "@mantine/core";

export function Home() {
  const location = useLocation();
  let content;

  if (location.pathname === '/'){
    content = <Text>Welcome to the home page!</Text>;
  }
  // } else if(location.pathname === '/createOrg'){
  //   content = <OrganisationReg/>
  // }

  return(
    <Flex style={{ height: '100vh'}}>
      <Box style={{ position: 'fixed', top: 0, left: 0, height: '100vh', overflow: 'auto', zIndex:"10" }}>
        <NavbarNested />
      </Box>

      <Box style={{ flex: 1, margin: "1rem" }}>
        <ScrollArea style={{ height: '100vh' }}>
          <Center>
            {content}
          </Center>
        </ScrollArea>
      </Box>
    </Flex>

  );
}