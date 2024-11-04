export interface UserLoginResponse {
    email?: string
    token: string
    rol: string
    nombre: string
    permissions: Permission[]
  }
  
  export interface Permission {
    id: number
    name: string
  }