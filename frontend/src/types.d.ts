interface Me{
    user: User,
    credentials: Credentials,
    isLogin: boolean
}

interface User{
    id: string,
    name: string,
    isLogin?: boolean
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

interface UserBasicInfo{
    id: string,
    info: Me
}