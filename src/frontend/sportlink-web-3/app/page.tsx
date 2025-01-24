"use client"

import { PageHeader } from "@/components/ui-custom/page-header"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ConfirmedOrganizationsPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const instructions = [
    { title: "Kreirajte korisnički račun", description: "Ako nemate korisnički račun, ulogirajte se i verificirajte svoj račun! Registrirani korisnici imaju više mogućnosti kod korištenja aplikacije." },
    { title: "Pronađite svoju aktivnost", description: "Čak i ako niste ulogirani možete pretraživati natjecanja, termine i grupe za trening vezane uz provjerene organizacije!" },
    { title: "Registrirajte svoju organizaciju", description: "Od sada svaki korisnik uz odobrenje administratora može kreirati svoju jednu ili više organizacija te ponuditi aktivnosti razne vezane uz vlastitu organizaciju." },
    {
      title: "Recenziranje organizacije",
      description: "Nama je Vaše mišljenje bitno! Kao registrirani korisnik možete ostaviti svoj komentar na sportsku organizaciju i tako pomoći drugim korisnicima u donošenju odluke.",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Dobrodošli u SportLink" description="Vaš centralni hub za sportsku organizaciju."><hr/></PageHeader>

      <motion.div
        className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Kako koristiti SportLink</h2>
        <p className="text-muted-foreground mb-6">
          Slijedite ove jednostavne korake kako biste maksimalno iskoristili našu platformu:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {instructions.map((instruction, index) => (
            <motion.div key={index} {...fadeIn} transition={{ delay: index * 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    {instruction.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{instruction.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
