export interface OwnerRegisterPayload {
    user_id?: string;
    firstName: string;
    lastName: string;
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
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
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
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
}

export type CreateOwnerResponse = ApiResponse<{
    message: string;
}>

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phone?: string;
}

export type UpdateProfileResponse = ApiResponse<{
    message: string;
}>
