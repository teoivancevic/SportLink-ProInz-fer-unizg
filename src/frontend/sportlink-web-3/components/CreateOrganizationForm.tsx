'use client'
import { Libraries } from '@react-google-maps/api';
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useLoadScript } from '@react-google-maps/api'
import { orgService } from '@/lib/services/api';


// Style definitions remain the same
const autocompleteStyle = `
  .pac-container {
    border-radius: 0.5rem;
    margin-top: 4px;
    padding: 0;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    box-shadow: none !important;
    font-family: var(--font-sans);
    z-index: 100;
  }

  .pac-item {
    padding: 8px 12px;
    border-top: 1px solid hsl(var(--border));
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
  }

  .pac-item:first-child {
    border-top: none;
  }

  .pac-item:hover {
    background-color: hsl(var(--accent));
  }

  .pac-item-selected {
    background-color: hsl(var(--accent));
  }

  .pac-item-query {
    color: hsl(var(--foreground));
    font-size: 14px;
    padding-right: 4px;
  }

  .pac-matched {
    font-weight: 600;
  }

  .pac-icon {
    display: none;
  }
`;

interface OrgError {
  message: string;
  status?: number;
  code?: string;
}

const formSchema = z.object({
  name: z.string()
    .min(3, 'Ime mora sadržavati između 3 i 100 znakova')
    .max(100, 'Ime mora sadržavati između 3 i 100 znakova'),
  description: z.string()
    .min(3, 'Opis mora sadržavati između 3 i 200 znakova')
    .max(200, 'Opis mora sadržavati između 3 i 200 znakova'),
  contactEmail: z.string()
    .email('Neispravna e-mail adresa'),
  contactPhone: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: 'Unesite pravi broj telefona',
  }),
  location: z.string()
    .min(1, 'Grad je obavezan')
});

type FormValues = z.infer<typeof formSchema>;

interface AutocompleteFieldProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}

const libraries: Libraries = ['places'];

export function CreateOrganizationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
    language: 'hr',
  });

  const AutocompleteComponent = useMemo(() => {
    const Component = ({ field }: AutocompleteFieldProps) => {
      const autocompleteRef = useRef<HTMLInputElement>(null);

      useEffect(() => {
        if (!autocompleteRef.current || !window.google) return;
      
        const inputElement = autocompleteRef.current; // Capture the current value
      
        const autocomplete = new google.maps.places.Autocomplete(inputElement, {
          componentRestrictions: { country: 'HR' },
          fields: ['formatted_address', 'geometry'],
          types: ['geocode']
        });
      
        const styleElement = document.createElement('style');
        styleElement.textContent = autocompleteStyle;
        document.head.appendChild(styleElement);
      
        const listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            field.onChange(place.formatted_address);
          }
        });
      
        const preventSubmit = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        };
      
        inputElement.addEventListener('keydown', preventSubmit);
      
        return () => {
          google.maps.event.removeListener(listener);
          inputElement.removeEventListener('keydown', preventSubmit);
          styleElement.remove();
        };
      }, [field]);

      return (
        <Input
          ref={autocompleteRef}
          placeholder="Enter address..."
          type="text"
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          autoComplete="off"
        />
      );
    };

    Component.displayName = 'AutocompleteComponent';
    return Component;
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      location: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await orgService.createOrganization(
        values.name,
        values.description,
        values.contactEmail,
        values.contactPhone,
        values.location,
        {
          name: values.name,
          description: values.description,
          contactEmail: values.contactEmail,
          contactPhoneNumber: values.contactPhone,
          location: values.location
        }
      );
      
      router.push('/');
    } catch (error: unknown) {
      console.error('Organization creation error:', error);
      let errorMessage = "Neuspješna prijava. Provjerite podatke i pokušajte ponovo.";
  
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as OrgError).message;
      }
  
      toast({
        title: "Greška",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loadError) {
    console.error('Google Maps failed to load:', loadError);
    return <div>Error loading Google Maps</div>;
  }

  return (
    // Your existing JSX remains the same
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your organization"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@acmecorp.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Phone
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="HR"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    {isLoaded ? (
                      <AutocompleteComponent field={field} />
                    ) : (
                      <Input placeholder="Loading..." disabled />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

CreateOrganizationForm.displayName = 'CreateOrganizationForm';
