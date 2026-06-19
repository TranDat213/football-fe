export interface OwnerRegisterPayload {
    user_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    stadium_name: string;
    address: string;
}

export type OwnerRegisterResponse = ApiResponse<{
    message: string;
}>

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfileResponse = ApiResponse<UserProfile>

export interface UpdateRolePayload {
    role: string;
}

export type UpdateRoleResponse = ApiResponse<{
    message: string;
}>  

export interface CreateOwnerPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
}

export type CreateOwnerResponse = ApiResponse<{
    message: string;
}>

export interface UpdateProfilePayload {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    phone?: string;
}

export type UpdateProfileResponse = ApiResponse<{
    message: string;
}>