export interface Tournament {
  id: number;
  name: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  entryFee: number;
  location: string;
  organizationName?: number;
  sportName: string;
  organizationId: number;
  sportId?: number;
}

export interface getTournamentsResponse {
    data: Tournament[];
}

  