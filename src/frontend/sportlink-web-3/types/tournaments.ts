export interface TournamentCreate {
    id: number;
    name: string;
    description: string;
    timeFrom: string;
    timeTo: string;
    entryFee: number;
    location: string;
    organizationId: number;
    sportName: string;
    sportId: number;
  }

export interface Tournament {
  id: number;
  name: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  entryFee: number;
  location: string;
  organizationId: number;
  sportName: string;
  sportId: number;
}

export interface getTournamentsResponse {
    data: Tournament[];
}
  