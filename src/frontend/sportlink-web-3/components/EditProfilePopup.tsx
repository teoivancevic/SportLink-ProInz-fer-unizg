'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LocationInput } from "@/components/location-input"
import { Organization } from '@/types/org'
import { useAuth } from './auth/auth-context'
import { UserRole } from '@/types/roles'
import AuthorizedElement from './auth/authorized-element'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useForm } from 'react-hook-form'

interface EditProfilePopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Organization) => void
  initialData: Organization
}

export default function EditProfilePopup({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditProfilePopupProps) {
  const { userData } = useAuth()

  const form = useForm({
    defaultValues: initialData,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (data: any) => {
    onSubmit(data);
  }

  if (!isOpen) return null

  return (
    <AuthorizedElement
      roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
      requireOrganizationEdit={true}
      orgOwnerUserId={initialData.owner.id.toString()}
    >
      {({ userData }) => (
        <div className="fixed top-[-50px] left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Uredi profil organizacije</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ime organizacije</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Corp"
                          {...field} 
                        />
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
                          placeholder="Tell us about your organization"
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@acmecorp.com"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <PhoneInput
                          international
                          defaultCountry="HR"
                          value={field.value}
                          onChange={(value) => {
                            form.setValue('contactPhoneNumber', value || '')
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LocationInput
                          value={field.value}
                          onChange={(value) => form.setValue('location', value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Odustani
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#228be6] hover:bg-[#1c7ed6] text-white"
                  >
                    Spremi promjene
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </AuthorizedElement>
  )
}
