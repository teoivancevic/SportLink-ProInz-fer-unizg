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
    location: string,
    rating: number,
    owner: Owner,
    socialNetworks: socialNetwork[]
}

export interface socialNetwork{
    type: number,
    link: string,
    username: string,
    organizationId: number
}

export interface Owner{
    id: number,
    firstName: string,
    lastName: string,
    email: string
}

// this is a list of organizations
export interface GetOrganizationResponse {
    data: Organization[]  // If the API returns { data: [...organizations] }
}

export interface GetOrganisationInfoResponse {
    data: Organization
}
