'use client'

import { useState } from 'react'
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Trash, Plus } from 'lucide-react'
import NavMenu from "@/components/nav-org-profile";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

interface TrainingGroup {
  id: number
  name: string
  ageFrom: number
  ageTo: number
  sex: 'Male' | 'Female' | 'Any'
  monthlyPrice: number
  description: string
  sport: string
  schedule: {
    day: string
    startTime: string
    endTime: string
  }[]
}

const initialTrainingGroups: TrainingGroup[] = [
  {
    id: 1,
    name: "Junior Soccer",
    ageFrom: 8,
    ageTo: 12,
    sex: 'Any',
    monthlyPrice: 100,
    description: "Introductory soccer training for kids",
    sport: "Soccer",
    schedule: [
      { day: "Monday", startTime: "16:00", endTime: "17:30" },
      { day: "Wednesday", startTime: "16:00", endTime: "17:30" },
    ]
  },
  {
    id: 2,
    name: "Teen Basketball",
    ageFrom: 13,
    ageTo: 17,
    sex: 'Any',
    monthlyPrice: 120,
    description: "Competitive basketball training for teenagers",
    sport: "Basketball",
    schedule: [
      { day: "Tuesday", startTime: "17:00", endTime: "19:00" },
      { day: "Thursday", startTime: "17:00", endTime: "19:00" },
      { day: "Saturday", startTime: "10:00", endTime: "12:00" },
    ]
  },
  {
    id: 3,
    name: "Women's Volleyball",
    ageFrom: 18,
    ageTo: 30,
    sex: 'Female',
    monthlyPrice: 80,
    description: "Recreational volleyball for adult women",
    sport: "Volleyball",
    schedule: [
      { day: "Monday", startTime: "19:00", endTime: "21:00" },
      { day: "Friday", startTime: "18:00", endTime: "20:00" },
    ]
  },
]

export default function TrainingGroups() {
  const [trainingGroups, setTrainingGroups] = useState<TrainingGroup[]>(initialTrainingGroups)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTrainingsId, setEditingTrainingsId] = useState<number | null>(null)
  const [editedGroup, setEditedGroup] = useState<TrainingGroup | null>(null)

  const handleEditClick = (group: TrainingGroup) => {
    setEditingId(group.id)
    setEditedGroup({ ...group })
  }

  const handleEditTrainingsClick = (group: TrainingGroup) => {
    setEditingTrainingsId(group.id)
    setEditedGroup({ ...group })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTrainingsId(null)
    setEditedGroup(null)
  }

  const handleSaveChanges = () => {
    if (editedGroup) {
      setTrainingGroups(groups =>
        groups.map(group => group.id === editedGroup.id ? editedGroup : group)
      )
      setEditingId(null)
      setEditingTrainingsId(null)
      setEditedGroup(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editedGroup) {
      setEditedGroup({
        ...editedGroup,
        [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
      })
    }
  }

  const handleScheduleChange = (index: number, field: string, value: string) => {
    if (editedGroup) {
      const newSchedule = [...editedGroup.schedule]
      newSchedule[index] = { ...newSchedule[index], [field]: value }
      setEditedGroup({ ...editedGroup, schedule: newSchedule })
    }
  }

  const handleDeleteTraining = (index: number) => {
    if (editedGroup) {
      const newSchedule = editedGroup.schedule.filter((_, i) => i !== index)
      setEditedGroup({ ...editedGroup, schedule: newSchedule })
    }
  }

  const handleAddTraining = () => {
    if (editedGroup) {
      const newSchedule = [...editedGroup.schedule, { day: '', startTime: '', endTime: '' }]
      setEditedGroup({ ...editedGroup, schedule: newSchedule })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <NavMenu/>
      <h1 className="text-3xl font-bold">Training Groups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingGroups.map((group) => (
          <Card key={group.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>
                {editingId === group.id ? (
                  <Input
                    name="name"
                    value={editedGroup?.name}
                    onChange={handleInputChange}
                    className="font-semibold text-lg"
                  />
                ) : (
                  group.name
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p>
                  <strong>Age Range:</strong>{' '}
                  {editingId === group.id ? (
                    <>
                      <Input
                        name="ageFrom"
                        type="number"
                        value={editedGroup?.ageFrom}
                        onChange={handleInputChange}
                        className="w-16 inline-block mr-2"
                      />
                      -
                      <Input
                        name="ageTo"
                        type="number"
                        value={editedGroup?.ageTo}
                        onChange={handleInputChange}
                        className="w-16 inline-block ml-2"
                      />
                    </>
                  ) : (
                    `${group.ageFrom} - ${group.ageTo} years`
                  )}
                </p>
                <p>
                  <strong>Sex:</strong>{' '}
                  {editingId === group.id ? (
                    <select
                      name="sex"
                      value={editedGroup?.sex}
                      onChange={handleInputChange}
                      className="rounded-md border border-input text-center"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Any">Any</option>
                    </select>
                  ) : (
                    group.sex
                  )}
                </p>
                <p>
                  <strong>Monthly Price:</strong>{' '}
                  {editingId === group.id ? (
                    <Input
                      name="monthlyPrice"
                      type="number"
                      value={editedGroup?.monthlyPrice}
                      onChange={handleInputChange}
                      className="w-24 inline-block"
                    />
                  ) : (
                    `$${group.monthlyPrice}`
                  )}
                </p>
                <p>
                  <strong>Sport:</strong>{' '}
                  {editingId === group.id ? (
                    <Input
                      name="sport"
                      value={editedGroup?.sport}
                      onChange={handleInputChange}
                    />
                  ) : (
                    group.sport
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {editingId === group.id ? (
                    <Textarea
                      name="description"
                      value={editedGroup?.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  ) : (
                    group.description
                  )}
                </p>
                <div>
                  <strong>Schedule:</strong>
                  {editingTrainingsId === group.id ? (
                    <div className="space-y-2 mt-2">
                      {editedGroup?.schedule.map((session, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <select
                            value={session.day}
                            onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                            className="rounded-md border border-input"
                          >
                            <option value="">Select day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                          <Input
                            type="time"
                            value={session.startTime}
                            onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                            className="w-24"
                          />
                          <Input
                            type="time"
                            value={session.endTime}
                            onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                            className="w-24"
                          />
                          <Button
                            onClick={() => handleDeleteTraining(index)}
                            variant="destructive"
                            size="icon"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={handleAddTraining} variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" /> Add Training
                      </Button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside">
                      {group.schedule.map((session, index) => (
                        <li key={index}>
                          {session.day}: {session.startTime} - {session.endTime}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
              <div>
                {editingId === group.id || editingTrainingsId === group.id ? (
                  <>
                    <Button onClick={handleSaveChanges} className="mr-2">Save Changes</Button>
                    <Button onClick={handleCancelEdit} variant="outline">Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEditClick(group)} className="mr-2">Edit</Button>
                    <Button onClick={() => handleEditTrainingsClick(group)} variant="outline">Edit Trainings</Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

