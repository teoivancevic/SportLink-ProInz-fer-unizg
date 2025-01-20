import '@mantine/core/styles.css';
import { IconAt } from '@tabler/icons-react';
import { useState } from 'react';
import { TextInput, Text, Paper, Center, Stack, rem, Textarea, Button } from '@mantine/core';
import { orgService } from '../../services/api';
import { CreateOrgRequest } from '../../types/org';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';

export function OrganizationReg() {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [loading, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const handleNameChange = (newName: string) => {
    setName(newName);
    setNameError(null);
    setErrorMessage(null);
    if(newName==""){ return;}
  
    if (newName.length < 3 || newName.length > 100) {
      setNameError('Ime mora sadržavati između 3 i 100 znakova');
    }
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setEmailError(null);
    setErrorMessage(null);
    if(newEmail == ""){ return; }
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('Neispravna e-mail adresa');
    }
  };

  const handleContactChange = (newContact: string) => {
    setContact(newContact);
    setContactError(null);
    setErrorMessage(null);
    if(newContact == ""){ return; }
    if (!/^\d+$/.test(newContact)) {
      setContactError('Polje može sadržavati isključivo brojke');
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    setDescriptionError(null);
    setErrorMessage(null);
    if (newDescription==""){return;}

    if (newDescription.length < 3 || newDescription.length > 200) {
      setDescriptionError('Opis mora sadržavati između 3 i 200 znakova');
    }
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (emailError || contactError || email=="" || name=="" || location=="" || description=="" || contact=="") {
      setErrorMessage('Ispunite sva polja ispravno prije prijave');
      return;
    }

    const organisationData: CreateOrgRequest = { 
      name: name, 
      description: description,
      contactEmail: email,
      contactPhoneNumber: contact,
      location: location
    };

    try {
      open();
      const response = await orgService.createOrganization(name, description, email, contact, location, organisationData);
      console.log(response.data);
      console.log("Request to create organization successfully sent.");
      navigate('/');
    } catch (error) {
      setErrorMessage("Neuspješna prijava. Provjerite podatke i pokušajte ponovo.");
      console.error('Error:', error);
      console.log(errorMessage);
    } finally {
      close();
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Paper radius="md" p="xl" withBorder style={{ width: '600px', backgroundColor: 'rgba(189, 189, 189, 0.2)', boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.4)' }}>
        <Text size="lg" fw={700} style={{ textAlign: "center", color: "#228be6" }}>
          REGISTRACIJA ORGANIZACIJE
        </Text>
        <Stack gap={10}>
          <TextInput
            required
            label="Ime"
            placeholder="Unesite ime"
            onChange={(event) => handleNameChange(event.currentTarget.value)}
            value={name}
            error={nameError}
            radius="sm"
            size="sm"
          />

          <TextInput
            required
            label="E-mail adresa"
            placeholder="Unesite e-mail"
            value={email}
            onChange={(event) => handleEmailChange(event.currentTarget.value)}
            error={emailError}
            radius="sm"
            leftSection={<IconAt stroke={1.5} style={{ width: rem(18), height: rem(18) }} />}
          />

          <TextInput
            required
            label="Kontakt"
            value={contact}
            onChange={(event) => handleContactChange(event.currentTarget.value)}
            placeholder="0981234567"
            error={contactError}
            radius="sm"
            size="sm"
          />

          <TextInput
            required
            label="Grad"
            value={location}
            onChange={(event) => handleLocationChange(event.currentTarget.value)}
            placeholder="Unesite grad"
            radius="sm"
            size="sm"
          />

           {/* <Group justify="space-around" >
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
            </Group> */}

          <Textarea
            required
            label="Opis Organizacije"
            placeholder="Unesite opis"
            autosize={false}
            value={description}
            onChange={(event) => handleDescriptionChange(event.currentTarget.value)}
            className="custom-textarea"
            style={{ height: '100px' }}
            error={descriptionError}
          />

        </Stack>

        <Center w="100%">
          <Button
            onClick={handleSubmit}
            className="loginButton"
            loading={loading}
            size="md"
            variant="light"
            color="blue"
            style={{ width: '60%' }}
          >
            REGISTRIRAJ ORGANIZACIJU
          </Button>
        </Center>
        {errorMessage && (
          <Text color="red" size="sm" style={{ marginTop: '10px', textAlign: 'center' }}>
            {errorMessage}
          </Text>
        )}
      </Paper>
    </Center>
  );
}
