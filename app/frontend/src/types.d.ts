interface Me{
    id: string,
    name: string,
    credentials: Credentials,
    isLogin: boolean
}

interface User{
    id: string,
    name: string
}

interface Credentials{
    email: string,
    password: string
}

interface UserRegisteInfo {
    name: string,
    credentials: Credentials
}

interface Exception{
    message?: string,
    status?: number
}
