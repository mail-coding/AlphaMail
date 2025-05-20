import { create } from 'zustand';
import { FolderResponse } from '../types/mail';

export interface MailAttachment {
  id: string; 
  file: File;
  name: string;
  size: number;
  type: string;
}

interface MailState {
  // 기존 상태
  currentFolder?: number;
  currentPage: number;
  sortOrder: number;
  searchKeyword: string;
  selectedMails: string[];
  attachments: MailAttachment[];
  
  // 메일 작성 관련 상태 추가
  recipients: string[];
  subject: string;
  content: string;
  threadId: string | null;
  inReplyTo: number | null;
  references: string[];
  isLoading: boolean;
  
  // 폴더 관련 상태 추가
  folders: FolderResponse[];
  folderLoading: boolean;
  
  // 기존 액션
  setCurrentFolder: (folderId?: number) => void;
  setCurrentPage: (page: number) => void;
  setSortOrder: (order: number) => void;
  setSearchKeyword: (keyword: string) => void;
  clearSearchKeyword: () => void;
  selectMail: (id: string) => void;
  unselectMail: (id: string) => void;
  selectAllMails: (ids: string[]) => void;
  clearSelection: () => void;
  addAttachment: (file: File) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  
  // 메일 작성 관련 액션 추가
  setRecipients: (recipients: string[]) => void;
  setSubject: (subject: string) => void;
  setContent: (content: string) => void;
  setThreadId: (threadId: string | null) => void;
  setInReplyTo: (inReplyTo: number | null) => void;
  setReferences: (references: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetComposeState: () => void;

  setFolders: (folders: FolderResponse[]) => void;
  setFolderLoading: (loading: boolean) => void;
  getFolderIdByType: (type: 'inbox' | 'sent' | 'trash') => number | undefined;
  resetFolderState: () => void;
}

export const useMailStore = create<MailState>((set, get) => ({
  // 기존 상태
  currentFolder: 1,
  currentPage: 1,
  sortOrder: 0,
  searchKeyword: '',
  selectedMails: [],
  attachments: [],
  
  // 메일 작성 관련 상태 추가
  recipients: [],
  subject: '',
  content: '',
  threadId: null,
  inReplyTo: null,
  references: [],
  isLoading: false,
  
  folders: [],
  folderLoading: false,

  // 기존 액션
  setCurrentFolder: (folderId) => set({ 
    currentFolder: folderId,
    currentPage: 1,
    searchKeyword: '',
    selectedMails: []
  }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setSortOrder: (order) => set({ 
    sortOrder: order,
    currentPage: 1
  }),
  
  setSearchKeyword: (keyword) => set({ 
    searchKeyword: keyword,
    currentPage: 1
  }),
  
  clearSearchKeyword: () => set({ searchKeyword: '' }), 

  selectMail: (id) => set((state) => ({
    selectedMails: [...state.selectedMails, id]
  })),
  
  unselectMail: (id) => set((state) => ({
    selectedMails: state.selectedMails.filter((mailId) => mailId !== id)
  })),
  
  selectAllMails: (ids) => set({
    selectedMails: ids
  }),
  
  clearSelection: () => set({
    selectedMails: []
  }),
  
  addAttachment: (file) => set((state) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newAttachment: MailAttachment = {
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    return {
      attachments: [...state.attachments, newAttachment]
    };
  }),
  
  removeAttachment: (id) => set((state) => ({
    attachments: state.attachments.filter(attachment => attachment.id !== id)
  })),
  
  clearAttachments: () => set({ attachments: [] }),
  
  // 메일 작성 관련 액션 추가
  setRecipients: (recipients) => set({ recipients }),
  
  setSubject: (subject) => set({ subject }),
  
  setContent: (content) => {
    console.log('메일 스토어 - 콘텐츠 설정:', content);
    set({ content });
    
    // 상태 변경 후 확인
    setTimeout(() => {
      const currentContent = get().content;
      console.log('메일 스토어 - 콘텐츠 설정 후 상태:', 
        currentContent ? currentContent : '빈 콘텐츠');
    }, 0);
  },
  
  setThreadId: (threadId) => set({ threadId }),
  
  setInReplyTo: (inReplyTo) => set({ inReplyTo }),
  
  setReferences: (references) => set({ references }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  resetComposeState: () => set({ 
    recipients: [],
    subject: '',
    content: '',
    threadId: null,
    inReplyTo: null,
    references: [],
    attachments: []
  }),

  resetFolderState: () => set({ 
    folders: [],
    currentFolder: undefined,
    folderLoading: false
  }),

  setFolders: (folders) => set({ folders }),
  setFolderLoading: (loading) => set({ folderLoading: loading }),
  getFolderIdByType: (type: 'inbox' | 'sent' | 'trash') => {
    const folders: FolderResponse[] = get().folders;
    
    // 폴더 타입에 따라 시스템 폴더 찾기
    switch (type) {
      case 'inbox':
        return folders.find(folder => folder.folderName === 'INBOX')?.id;
      case 'sent':
        return folders.find(folder => folder.folderName === 'SENT')?.id;
      case 'trash':
        return folders.find(folder => folder.folderName === 'TRASH')?.id;
      default:
        return undefined;
    }
  }
}));