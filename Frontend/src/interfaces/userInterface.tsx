export interface UserInterface {
  id: number
  username: string
  password: string
  role: string
}

export interface UserAddFormInterface {
  id?: number
  username: string
  password: string
  role: string
}

export interface UserEditFormInterface {
  id?: number
  username: string
  role: string
}

export interface EditUserRequestBody extends UserEditFormInterface {
  id: number
}
