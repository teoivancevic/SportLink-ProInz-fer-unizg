import { Text } from "@mantine/core";
import { NavbarNested } from "../components/NavbarNested";


export function Home() {
  return(
    <div className='mainPage'>
      <NavbarNested/>
      <Text>SportLink je platforma namijenjena rekreativnim sportašima svih uzrasta za otkrivanje sportskih klubova, događanja i rezervacije termina.
      </Text>
    </div>

  );
}