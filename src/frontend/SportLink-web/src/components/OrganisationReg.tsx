import '@mantine/core/styles.css';
import { IconAt } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {TextInput, Text, Paper, Group, PaperProps, Button, MultiSelect, Center, Stack, rem, Textarea} from '@mantine/core';


export function OrganisationReg(props: PaperProps) {

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder style={{ width: '622px', height: '630px', backgroundColor: 'rgba(189, 189, 189, 0.2)', boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.4)'}} {...props}>
      <Text size="lg" fw={700} align="center" color="#228be6">
        REGISTRACIJA ORGANIZACIJE
        </Text>

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>

            <TextInput
                required
                label="Ime"
                placeholder="name"
                radius="sm"
                size='sm'
            />  

            <TextInput
                required
                label="E-mail adresa"
                placeholder="Your mail"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Invalid email'}
                radius="sm"
                leftSection={<IconAt
                    stroke={1.5}
                    style={{ width: rem(18), height: rem(18) }}
                    />}
            />   

            <TextInput
                required
                label="Kontakt"
                placeholder="098/1234-567"
                radius="sm"
                size='sm'
            />        

            <Group justify="space-between" >
                <TextInput
                    required
                    label="Grad"
                    placeholder="town"
                    radius="sm"
                    size='sm'
                    style={{ width: '48%' }}
                />     

                <TextInput
                    required
                    label="Ulica i broj"
                    placeholder="organisation address"
                    radius="sm"
                    size='sm'
                    style={{ width: '48%' }}
                />   
            </Group>

            <Group justify="space-around" >
                <MultiSelect
                    required
                    data={["Natjecanje", "Grupe", "Termini"]}
                    label="Vrste organizacije"
                    placeholder="type of organisation"
                    maxDropdownHeight={120}
                    style={{ width: '44%'}}
                    styles={{
                        input: { height: '30px', overflowY: 'hidden' }, // Fix height of input box
                        }}
                />  

                <MultiSelect
                    required
                    data={["Nogomet", "Kosarka", "Rukomet", "Tenis", "Padel"]}
                    label="Vrsta sporta"
                    placeholder="sports"
                    style={{ width: '44%'}}
                    maxDropdownHeight={120}
                    styles={{
                        input: { height: '30px', overflowY: 'hidden' }, // Fix height of input box
                        }}
                />   
            </Group>

            <Textarea 
                required
                label="Opis Organizacije"
                placeholder="about section"
                autosize={false}
                className="custom-textarea"
                style={{ height: '100px' }}
            />

        </Stack>

        <Center w="100%">
            <Button
                type="submit"
                className="loginButton"
                size="md"
                variant="light"
                color="blue"
                style={{width: '60%'}}>
                REGISTRIRAJ ORGANIZACIJU
            </Button>
        </Center>
      </form>
    </Paper>
  );
}