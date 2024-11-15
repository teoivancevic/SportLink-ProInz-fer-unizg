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
