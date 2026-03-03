export interface FortuneRequest {
  date: string;
  time: string;
  gender: "male" | "female";
  longitude?: number;
  year?: number;
  from_year?: number;
  years?: number;
  template?: "lite" | "pro" | "executive";
  format?: "markdown" | "json";
}

export interface FortuneResponse {
  success: boolean;
  data?: {
    date: string;
    time: string;
    gender: string;
    template: string;
  };
  report?: string;
  message?: string;
  request_id?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
}
