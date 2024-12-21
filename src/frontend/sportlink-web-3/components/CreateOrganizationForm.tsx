'use client'
import { Libraries, LoadScriptProps } from '@react-google-maps/api';


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
import { ToastAction } from "@/components/ui/toast"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createOrganization } from '@/components/actions/createOrganization'
import { Mail, Phone, MapPin } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useLoadScript } from '@react-google-maps/api'

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  contactEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  contactPhone: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: 'Please enter a valid phone number.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
})

// Define libraries array outside component to prevent reloads
// const libraries: ("places")[] = ['places'];
const libraries: Libraries = ['places'];

export function CreateOrganizationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
    language: 'hr', // Set to Croatian
  });

  const AutocompleteComponent = useMemo(() => {
    return ({ field }: any) => {
      const autocompleteRef = useRef<HTMLInputElement>(null);
  
      useEffect(() => {
        if (!autocompleteRef.current || !window.google) return;
  
        const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
          componentRestrictions: { country: 'HR' }, // Restrict to Croatia
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
  
        // Prevent form submission on enter
        autocompleteRef.current.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        });
  
        return () => {
          google.maps.event.removeListener(listener);
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
  }, [isLoaded]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      location: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { toast } = useToast()
    
    setIsSubmitting(true)
    try {
      const result = await createOrganization(values)
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        })
        router.push('/organizations') // Redirect to organizations list page
      } else {
        throw new Error('Failed to create organization')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create organization. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadError) {
    console.error('Google Maps failed to load:', loadError);
    return <div>Error loading Google Maps</div>;
  }

  return (
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
  )
}

