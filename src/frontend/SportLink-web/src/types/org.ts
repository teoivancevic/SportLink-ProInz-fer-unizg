export interface CreateOrgRequest {
    name: string;
    description: string;
    contactEmail: string;
    contactPhoneNumber: string;
    location: string;
}

export interface CreateOrgResponse {
    name: string;
    description: string;
    contactEmail: string;
    contactPhoneNumber: string;
    location: string;
}


export interface Organization{
    name: string,
    description: string,
    contactEmail: string,
    contactPhoneNumber: string,
    location: string
}
// this is a list of organizations
export type GetOrganizationResponse = Organization[];
