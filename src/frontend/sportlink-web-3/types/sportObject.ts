export interface WorkTime {
    id?: number; 
    dayOfWeek: number;
    isWorking?: boolean; 
    openFrom: string;
    openTo: string;
    sportsObjectId: number;
  }
  
  export interface SportCourt {
    id: number;
    sportsObjectId: number;
    availableCourts: number;
    maxHourlyPrice: number;
    sportName?: string;
    sportId?: number;
  }
  
  export interface SportObject {
    id: number;
    name: string;
    description: string;
    location: string;
    organizationId?: number;
    workTimes: WorkTime[];
    sportCourts: SportCourt[];
  }

  export interface SportObjectSearch {
    id: number,
    name: string,
    location: string, 
    organizationName: string,
    sportCourtDtos: [
      {
        id: number
        availableCourts: number,
        sportName: string,
        minHourlyPrice: number,
        maxHourlyPrice: number,
        sportsObjectId: number
      }
    ]
    organizationId: number
  }

  export interface getSportObjectsResponse {
    data: SportObject[];
  }

  export interface getSportObjectsSearch {
    data: SportObjectSearch[];
  }

  
  