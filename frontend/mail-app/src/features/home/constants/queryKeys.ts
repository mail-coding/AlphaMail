import { AssistantType } from "../types/home";

export const homeQueryKeys = {
    assistants: ['assistants'] as const,
    assistantById: (id: number) => ['assistants', id] as const,
    temporarySchedule: (id: number) => ['assistants', 'schedules', id] as const,
    temporaryPurchaseOrder: (id: number | null) => ['temporaryPurchaseOrder', id] as const,
    temporaryClient: (id: number | null) => ['temporaryClient', id] as const,
    temporaryQuote: (id: number | null) => ['temporaryQuote', id] as const,
    emailByType: (type: AssistantType, id: number | null) => ['email', type, id] as const
  };