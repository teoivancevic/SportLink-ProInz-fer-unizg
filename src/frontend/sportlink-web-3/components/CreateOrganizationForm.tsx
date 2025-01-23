'use client'
import { useState } from 'react'
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
import { orgService } from '@/lib/services/api';
import { LocationInput } from './location-input';


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

export function CreateOrganizationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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

  return (
    // Your existing JSX remains the same
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Kreiraj novu sportsku organizaciju</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naziv organizacije</FormLabel>
                  <FormControl>
                    <Input placeholder="npr. KK Sesvete" {...field} />
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
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Opisite svoju organizaciju"
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
                      Kontakt Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="npr. kontakt@organizacija.com" {...field} />
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
                      Kontakt broj mobitela
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
                  <FormControl>
                    <LocationInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Kreiraj organizaciju'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

CreateOrganizationForm.displayName = 'CreateOrganizationForm';
