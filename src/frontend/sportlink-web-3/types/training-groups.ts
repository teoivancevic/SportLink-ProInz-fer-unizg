export interface TrainingGroup {
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
  
  