export interface Client {
    id: number;
    corpName: string;
    representative: string;
    licenseNumber: string;
    phoneNumber: string;
    email: string;
    address: string;
    isSelected?: boolean;
  }

  export interface ClientDetail {
    id: number;
    corpName: string;
    representative: string;
    licenseNum: string;
    phoneNum: string;
    email: string;
    address: string;
    businessType: string;
    businessItem: string;
    businessLicense: string;
    createdAt: string;
    updatedAt: string | null;
  }
  
  export interface ClientResponse {
    contents: Client[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  }
  
  export interface CreateClientRequest {
    name: string;
    ceo: string;
    business_no: string;
    contact: string;
    email: string;
    address: string;
    item?: string;
    type?: string;
    address_detail?: string;
  }
  
  export interface UpdateClientRequest extends Partial<CreateClientRequest> {
    id: number;
  }
  
  export interface ClientQueryParams {
    page?: number;
    size?: number;
    search?: string;
    sort?: string;
  }