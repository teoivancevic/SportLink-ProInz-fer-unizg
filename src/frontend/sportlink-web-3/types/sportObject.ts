export interface SportsObject {
    id: number,
    name: string,
    location: string, 
    organizationName: string,
    sportCourtDtos: SportCourtDto[]
    organizationId: number
}

export interface SportCourtDto {
    id: number,
    availableCourts: number,
    sportName: string,
    minHourlyPrice: number,
    maxHourlyPrice: number,
    sportsObjectId: number
}

export interface searchSportsObjectsResponse {
    data: SportsObject[]
}