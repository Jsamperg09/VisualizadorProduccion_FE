export interface UserData {
  id: number
  nombre: string
  apellido: string
  correo: string
  estado: string
  rut: string
  tipoUsuario: string,
  idTipoUsuario: number
}

export interface UserCreateData {
  id?: number
  nombre: string
  apellido: string
  email: string
  rut: string
  idTipoUsuario: number
}

export interface FilterTableUser {
  nombre: string
  apellido: string
  correo: string
  tipoUsuario: string
}