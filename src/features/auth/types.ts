/** The signed-in user's profile, as returned by `GET /api/auth/me/`. */
export type User = {
  id: number;
  email: string;
  full_name: string;
  student_id: string;
  department: string;
  phone: string;
  avatar: string | null;
  is_email_verified: boolean;
  date_joined: string;
};

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
};
