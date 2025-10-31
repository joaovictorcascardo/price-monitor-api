export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  birth_date: Date;
  phone?: string;
}

export interface UserWithoutPasswordDTO {
  id: number;
  name: string;
  email: string;
  birth_date: Date;
  phone: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserGetMeDTO {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  birth_date: Date;
}
