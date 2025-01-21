'use client'

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Plus, PencilIcon, Trash2Icon } from 'lucide-react'
import { AddTrainingGroup, reverseDayOfWeekMapping } from './add-training-group-form'
import { getTrainingGroupsResponse, TrainingGroup } from "../../../../types/training-groups"
import NavMenu from "@/components/nav-org-profile"
import { trainingGroupService } from '@/lib/services/api'
import { useEffect, useState } from "react"
import AuthorizedElement from "@/components/auth/authorized-element"
import { UserRole } from "@/types/roles"


const initialTrainingGroups: TrainingGroup[] = []

export default function TrainingGroups({ params }: { params: { id: number } }) {
  const [groups, setGroups] = useState<TrainingGroup[]>(initialTrainingGroups)
  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<TrainingGroup | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTrainingGroups = async () => {
      try {
        const response: getTrainingGroupsResponse = await trainingGroupService.getTrainingGroups(params.id)
        console.log(response);
        setGroups(response.data)
      } catch (error) {
        console.error('Error fetching tournaments:', error)
      } 
  }
  useEffect(() => { fetchTrainingGroups() }, [])

  const handleSubmit = async (newGroup: TrainingGroup) => {
    setIsSubmitting(true); 
    if (editingGroup) {
      try {
        const response: boolean = await trainingGroupService.updateTrainingGroup(newGroup, newGroup.id);
        console.log(response);
        const groups: getTrainingGroupsResponse = await trainingGroupService.getTrainingGroups(params.id)
        console.log(groups)
        setGroups(groups.data)
      } catch (error){
        console.error('Error updating group:', error)
      }
    } else {
      try {
        newGroup.organizationId = Number(params.id);
        const response: boolean = await trainingGroupService.createTrainingGroup(newGroup, params.id);
        console.log(response);
        const groups: getTrainingGroupsResponse = await trainingGroupService.getTrainingGroups(params.id)
        console.log(groups)
        setGroups(groups.data)
      } catch (error){
        console.error('Error adding new group:', error)
      }
    }
    setShowForm(false)
    setEditingGroup(undefined)
    setIsSubmitting(false); 
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Jesteli sigurni da želite izbrisati ovu grupu za trening?')) {
      try {
        const response: boolean = await trainingGroupService.deleteTrainingGroup(id);
        if (response) {
          setGroups(prev => prev.filter(group => group.id !== id))
        } else {
          console.error('Failed to delete the group.');
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleEdit = (group: TrainingGroup) => {
    setEditingGroup(group)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingGroup(undefined)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu orgId={params.id}/>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Grupe za trening</h1>

        <AuthorizedElement 
            roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
            requireOrganizationEdit = {false}
            orgOwnerUserId={params.id.toString()}>
            {(userData) => (
              <Button
              onClick={() => setShowForm(true)}
              disabled={showForm}
              className={`bg-[#228be6] hover:bg-[#1c7ed6] text-white ${showForm ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Plus className="mr-2 h-4 w-4" /> Dodaj grupu za trening
            </Button>
            )}
          </AuthorizedElement>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col max-h-[400px] overflow-y-auto">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{group.sportName}</p>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto">
                <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Dob: {group.ageFrom}-{group.ageTo}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Spol: {group.sex}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">€{group.monthlyPrice}/mjesec</span>
                </div>
                <div className="space-y-2">
                  {group.trainingSchedules.map((session, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span className="mr-2">{reverseDayOfWeekMapping[session.dayOfWeek]}:</span>
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{session.startTime.slice(0, 5)} - {session.endTime.slice(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <AuthorizedElement 
                roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
                requireOrganizationEdit = {false}
                orgOwnerUserId={params.id.toString()}
              >
                {(userData) => (
                    <CardFooter>
                    <div className="flex justify-end space-x-2 mt-4 w-full">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(group)} disabled={showForm}>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Uredi
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(group.id)} disabled={showForm}>
                        <Trash2Icon className="h-4 w-4 mr-2" />
                        Izbriši
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </AuthorizedElement>
              
            </Card>
          ))}
        </div>
        {showForm && (
          <div className="w-full lg:w-1/3 lg:min-w-[300px]">
            <AddTrainingGroup
              group={editingGroup}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={isSubmitting} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
