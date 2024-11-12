import '@mantine/core/styles.css';
import { IconAt } from '@tabler/icons-react';
import { useState } from 'react';
import {TextInput, Text, Paper, Group, PaperProps, Button, MultiSelect, Center, Stack, rem, Textarea} from '@mantine/core';
import { orgService } from '../services/api-example';
import { CreateOrgRequest } from '../types/org';
import { useNavigate } from 'react-router-dom';


export function OrganisationReg(props: PaperProps) {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
  const handleEmailChange = (newEmail: string) => {setEmail(newEmail); setErrorMessage(null)};
  const handleNameChange = (newName: string) =>  {setName(newName); setErrorMessage(null)};
  const handleContactChange = (newContact: string) => {setContact(newContact); setErrorMessage(null)};
  const handleDescriptionChange = (newDescription: string) =>  {setDescription(newDescription); setErrorMessage(null)};
  const handleLocationChange = (newLocation: string) =>  {setLocation(newLocation); setErrorMessage(null)};

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("clicked")
    const organisationData: CreateOrgRequest = { 
      name:name, 
      description: description,
      contactEmail: email,
      contactPhoneNumber: contact,
      location: location
     };
    

    try {
      const response = await orgService.createOrganization(name, description, email, contact, location, organisationData);
      console.log(response.data);
      console.log("Request to create organization successfully sent.");
      navigate('/');

    } catch (error) {
      console.error('Error:', error);
      console.log(errorMessage);
    }
  };

  return (
    <Center>
    <Paper radius="md" p="xl" withBorder style={{ width: '622px', height: '630px', backgroundColor: 'rgba(189, 189, 189, 0.2)', boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.4)'}} {...props}>
      <Text size="lg" fw={700} style={{textAlign:"center", color:"#228be6"}}>
        REGISTRACIJA ORGANIZACIJE
      </Text>

      
        <Stack>

            <TextInput
                required
                label="Ime"
                placeholder="Unesite ime"
                onChange={(event) => handleNameChange(event.currentTarget.value)}
                value={name}
                radius="sm"
                size='sm'
                
            />  

            <TextInput
                required
                label="E-mail adresa"
                placeholder="Unesite e-mail"
                value={email}
                onChange={(event) => handleEmailChange(event.currentTarget.value)}
                // error={form.errors.email && 'Invalid email'}
                radius="sm"
                leftSection={<IconAt
                    stroke={1.5}
                    style={{ width: rem(18), height: rem(18) }}
                    />}
            />   

            <TextInput
                required
                label="Kontakt"
                value={contact}
                onChange={(event) => handleContactChange(event.currentTarget.value)}
                placeholder="0981234567"
                radius="sm"
                size='sm'
            />        

            <Group justify="space-between" >
                <TextInput
                    required
                    label="Grad"
                    value={location}
                    onChange={(event) => handleLocationChange(event.currentTarget.value)}
                    placeholder="Unesite grad"
                    radius="sm"
                    size='sm'
                    style={{ width: '48%' }}
                />     

                <TextInput
                    required
                    label="Ulica i broj"
                    placeholder="Adresa organizacije"
                    radius="sm"
                    size='sm'
                    style={{ width: '48%' }}
                />   
            </Group>

            <Group justify="space-around" >
                <MultiSelect
                    required
                    data={["Natjecanje", "Grupe", "Termini"]}
                    label="Želim oglašavati"
                    placeholder="Tip"
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
                    placeholder="Sportovi"
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
                placeholder="Unesite opis"
                autosize={false}
                value={description}
                onChange={(event) => handleDescriptionChange(event.currentTarget.value)}
                className="custom-textarea"
                style={{ height: '100px' }}
            />

        </Stack>

        <Center w="100%">
            <Button
              onClick={handleSubmit}
                className="loginButton"
                size="md"
                variant="light"
                color="blue"
                style={{width: '60%'}}>
                REGISTRIRAJ ORGANIZACIJU
            </Button>
        </Center>
    </Paper>
    </Center>
  );
}