/** Authenticated user profile. */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

/** Response returned from login/register endpoints. */
export interface AuthResponse {
  user: User;
  token: string;
}
