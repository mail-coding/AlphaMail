import { Attachment } from "@/features/mail/types/mail";

// AI 비서 항목 타입
export type AssistantType = 'PURCHASE_ORDER' | 'QUOTE' | 'CLIENT' | 'SCHEDULE';

// AI 비서 항목 인터페이스
export interface AssistantItem {
  id: number;
  type: AssistantType;
  title?: string | null;
  userId: number;
  emailId: number;
  emailTime: string;
}

// AI 비서 응답 인터페이스
export interface AssistantsResponse {
  contents: AssistantItem[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

// AI 비서 요청 파라미터
export interface AssistantsParams {
  page?: number;
  size?: number;
  sort?: number;
}

export interface TemporaryScheduleDetail {
  temporaryScheduleId: number;
  email: {
    emailId: number;
    folderId: number;
    userId: number;
    messageId: string;
    sesMessageId: string | null;
    sender: string;
    recipients: string[];
    subject: string;
    bodyText: string;
    bodyHtml: string;
    receivedDateTime: string;
    sentDateTime: string | null;
    readStatus: boolean;
    hasAttachment: boolean;
    inReplyTo: string;
    references: string;
    threadId: string;
    filePath: string | null;
    emailType: string;
    emailStatus: string | null;
    originalFolderId: number | null;
  };
  name: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface ClientDetail {
  clientId: number;
  clientName: string;
  licenseNum?: string;
  representative?: string;
  businessType?: string;
  businessItem?: string;
}

export interface TemporaryPurchaseOrderDetail {
  id: number;
  userName: string;
  title: string;
  email: {
    emailId: number;
    folderId: number;
    userId: number;
    messageId: string;
    sesMessageId: string | null;
    sender: string;
    recipients: string[];
    subject: string;
    bodyText: string;
    bodyHtml: string;
    receivedDateTime: string;
    sentDateTime: string | null;
    readStatus: boolean;
    hasAttachment: boolean;
    inReplyTo: string | null;
    references: string | null;
    threadId: string;
    filePath: string | null;
    emailType: string;
    emailStatus: string | null;
    originalFolderId: number | null;
  };
  emailAttachments: Attachment[];
  clientName?: string | null;
  client?: ClientDetail | null;
  deliverAt: string | null;
  createdAt: string;
  shippingAddress: string | null;
  hasShippingAddress: boolean;
  manager: string | null;
  managerNumber: string | null;
  paymentTerm: string | null;
  products: {
    id: number;
    product: {
      productId: number;
      companyId: number;
      name: string;
      standard: string;
      stock: number;
      inboundPrice: number;
      outboundPrice: number;
      image: string;
      createdAt: string;
      updatedAt: string | null;
      deletedAt: string | null;
    } | null;
    productName: string | null;
    count: number;
  }[];
}

export interface UpdateTemporaryPurchaseOrderRequest {
  clientName?: string;
  clientId?: number;
  deliverAt?: string;
  shippingAddress?: string;
  hasShippingAddress?: boolean;
  manager?: string;
  managerNumber?: string;
  paymentTerm?: string;
  products?: {
    productId?: number;
    productName?: string;
    count: number;
  }[];
}

export interface TemporaryQuoteDetail {
  id: number;
  userName: string;
  title: string;
  email: {
    emailId: number;
    folderId: number;
    userId: number;
    messageId: string;
    sesMessageId: string | null;
    sender: string;
    recipients: string[];
    subject: string;
    bodyText: string;
    bodyHtml: string;
    receivedDateTime: string;
    sentDateTime: string | null;
    readStatus: boolean;
    hasAttachment: boolean;
    inReplyTo: string | null;
    references: string | null;
    threadId: string;
    filePath: string | null;
    emailType: string;
    emailStatus: string | null;
    originalFolderId: number | null;
  };
  emailAttachments: Attachment[];
  clientName: string | null;
  client: ClientDetail | null;
  createdAt: string;
  shippingAddress: string | null;
  hasShippingAddress: boolean;
  manager: string | null;
  managerNumber: string | null;
  products: {
    id: number;
    product: {
      productId: number;
      companyId: number;
      name: string;
      standard: string;
      stock: number;
      inboundPrice: number;
      outboundPrice: number;
      image: string;
      createdAt: string;
      updatedAt: string | null;
      deletedAt: string | null;
    } | null;
    productName: string | null;
    count: number;
  }[];
}

export interface UpdateTemporaryQuoteRequest {
  clientName?: string;
  clientId?: number;
  shippingAddress?: string;
  hasShippingAddress?: boolean;
  manager?: string;
  managerNumber?: string;
  products?: {
    productId?: number;
    productName?: string;
    count: number;
  }[];
}

export interface TemporaryClientDetail {
  id: number;
  userId: number;
  licenseNum: string;
  address: string;
  corpName: string;
  representative: string;
  businessType: string;
  businessItem: string;
  clientEmail: string;
  phoneNumber: string;
  businessLicense: string;
  email: {
    emailId: number;
    folderId: number;
    userId: number;
    messageId: string;
    sesMessageId: string;
    sender: string;
    recipients: string[];
    subject: string;
    bodyText: string;
    bodyHtml: string;
    receivedDateTime: string;
    sentDateTime: string;
    readStatus: boolean;
    hasAttachment: boolean;
    inReplyTo: string | null;
    references: string | null;
    threadId: string;
    filePath: string;
    emailType: string;
    emailStatus: string | null;
    originalFolderId: number | null;
  };
  emailAttachments: Array<{
    id: number;
    emailId: number;
    name: string;
    s3Key: string;
    size: number;
    type: string;
  }>;
}

// 임시 거래처 업데이트 요청 타입
export interface UpdateTemporaryClientRequest {
  licenseNum?: string;
  address?: string;
  corpName?: string;
  representative?: string;
  businessType?: string;
  businessItem?: string;
  email?: string;
  phoneNumber?: string;
  businessLicense?: string;
}

export interface RegisterClientRequest {
  TemporaryClientId: number; // 대문자 T로 시작하는 것에 주의
  companyId: number;
  groupId: number;
  licenseNum: string;
  address: string;
  corpName: string;
  representative: string;
  businessType: string;
  businessItem: string;
  email?: string;
  phoneNumber?: string;
  businessLicense?: string;
}

// 태그 타입 매핑 (API 응답 타입 -> UI 표시 타입)
export const assistantTypeMap: Record<AssistantType, '발주서' | '견적서' | '거래처' | '일정'> = {
  PURCHASE_ORDER: '발주서',
  QUOTE: '견적서',
  CLIENT: '거래처',
  SCHEDULE: '일정'
};