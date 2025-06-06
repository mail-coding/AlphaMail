export interface Client {
    id: number;
    name: string;
    manager: string;
    managerNumber: string;
    licenseNumber: string;
    businessType: string;
    businessItem: string;
    address: string;
    corpName: string;
    representative: string;
    phoneNumber: string;
    email: string;
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
    businessLicenseUrl: string;
    businessLicenseName: string;
    createdAt: string;   // TODO: 현재 사용하지 않아 String으로 설정하였지만, 후에 Date로 변경해야 함
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