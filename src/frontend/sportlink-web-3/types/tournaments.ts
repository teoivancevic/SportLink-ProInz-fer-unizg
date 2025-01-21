export interface Tournament {
  id: number;
  name: string;
  timeFrom: string;
  timeTo: string;
  entryFee: number;
  location: string;
  organizationName: number;
  sportName: string;
  organizationId: number;
}

export interface getTournamentsResponse {
    data: Tournament[];
}

  