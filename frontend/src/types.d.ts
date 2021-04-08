interface Me{
    user: User,
    credentials: Credentials,
    isLogin: boolean,
    information_room: string
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

interface AfterLoginInfo{
    id: string,
    name: string,
    isLogin?: boolean,
    information_room: string
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
    user: User,
    credentials: Credentials 
}