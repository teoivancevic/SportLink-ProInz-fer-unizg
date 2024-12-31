export interface CreateOrgRequest {
    name: string;
    description: string;
    contactEmail: string;
    contactPhoneNumber: string;
    location: string;
}

export interface CreateOrgResponse {
    id: number;
    name: string;
    description: string;
    contactEmail: string;
    contactPhoneNumber: string;
    location: string;
}


export interface Organization{
    id: number,
    name: string,
    description: string,
    contactEmail: string,
    contactPhoneNumber: string,
    location: string
}
// this is a list of organizations
export interface GetOrganizationResponse {
    data: Organization[]  // If the API returns { data: [...organizations] }
}
