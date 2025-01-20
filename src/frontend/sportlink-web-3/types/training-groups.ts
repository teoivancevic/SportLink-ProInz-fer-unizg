export interface TrainingGroup {
    id: number
    name: string
    ageFrom: number
    ageTo: number
    sex: 'Male' | 'Female' | 'Unisex'
    monthlyPrice: number
    description: string
    organizationId: number
    sportId: number
    sportName: string
    trainingSchedules: {
      id: number
      dayOfWeek: number
      startTime: string
      endTime: string
      trainingGroupId: number
    }[]
  }

  export interface getTrainingGroupsResponse {
    data: TrainingGroup[];
  }
  
  