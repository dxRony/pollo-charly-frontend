export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface LoginResponse {
  user: User
  token: string
}
