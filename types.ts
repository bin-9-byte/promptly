export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

export interface PromptFormData {
  title: string;
  content: string;
  tags: string;
}

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}