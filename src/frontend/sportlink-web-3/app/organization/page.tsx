'use client'
import { useState } from 'react'
import { Star, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EditProfilePopup from '../../components/EditProfilePopup'
import { useRouter } from 'next/navigation'
import NavMenu from "@/components/nav-org-profile";

interface OrganizationInfo {
  name: string;
  description: string;
  email: string;
  phone: string;
  location: string;
}

export default function OrgHomePage() {
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo>({
    name: "Sportska Organizacija XYZ",
    description: "Naša organizacija se bavi promocijom i razvojem sporta u lokalnoj zajednici već više od 20 godina.",
    email: "info@sportorg.com",
    phone: "+385 1 234 5678",
    location: "Sportska ulica 123, 10000 Zagreb"
  })

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)

  const handleEditSubmit = (newInfo: OrganizationInfo) => {
    setOrgInfo(newInfo)
    setIsEditPopupOpen(false)
  }

  const router = useRouter()
  const handleReviewClick = () => {
    router.push('/organization/reviews')
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <NavMenu></NavMenu>
      <h1 className="text-3xl font-bold mb-6">Informacije</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>O nama</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditPopupOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Uredi
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">{orgInfo.name}</h2>
            <p>{orgInfo.description}</p>
            <div>
              <p><strong>Email:</strong> {orgInfo.email}</p>
              <p><strong>Telefon:</strong> {orgInfo.phone}</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:underline">Facebook</a>
              <a href="#" className="text-blue-400 hover:underline">Twitter</a>
              <a href="#" className="text-pink-600 hover:underline">Instagram</a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokacija</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{orgInfo.location}</p>
            <img 
              src="/placeholder.svg?height=300&width=400" 
              alt="Karta lokacije" 
              className="w-full h-auto rounded-lg"
            />
          </CardContent>
        </Card>
      </div>

      <div onClick={handleReviewClick} className="cursor-pointer">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recenzije</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold">4.8 / 5</span>
            </div>
            <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4">
              "Izvrsna organizacija s vrhunskim trenerima i odličnim programima za sve uzraste!"
            </blockquote>
            <p className="text-sm text-gray-600">- Ana K., član 2 godine</p>
          </CardContent>
        </Card>
      </div>

      <EditProfilePopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={orgInfo}
      />
    </div>
  )
}


