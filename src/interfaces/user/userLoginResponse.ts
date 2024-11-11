export interface UserLoginResponse {
    email?: string
    token: string
    rol: string
    nombre: string
    apellido: string,
    rut: string,
    id?: number
    idTipoUsuario: string,
    permissions: Permission[]
  }
  
  export interface Permission {
    id: number
    name: string
  }