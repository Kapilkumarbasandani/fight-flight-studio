export interface Form {
  id: string;
  title: string;
  description: string;
  required: boolean;
  fields: string[];
}

export interface FormSubmission {
  _id?: string;
  userId: string;
  formId: string;
  formData: Record<string, any>;
  submittedAt: Date;
  signature?: string;
}

export interface FormSubmissionResponse {
  _id: string;
  userId: string;
  formId: string;
  formData: Record<string, any>;
  submittedAt: string;
  signature?: string;
}
