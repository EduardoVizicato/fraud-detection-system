type User = {
    name: string;
    email: string;
    password: string;
}

const KEY_USER = "demo_user"
const KEY_SESSION = "demo_session"

export function signUp(user: User){
    localStorage.setItem(KEY_USER, JSON.stringify(user));
    localStorage.setItem(KEY_SESSION, JSON.stringify({email: user.email, at: Date.now()}));
}

export function login(email: string, password: string){
    const raw = localStorage.getItem(KEY_USER);
    if(!raw)
        throw new Error("User not found")

    const user: User = JSON.parse(raw);
    if(user.email !== email || user.password !== password){
        throw new Error("Email or password invalid")
    }

    localStorage.setItem(KEY_SESSION, JSON.stringify({email: user.email, at: Date.now()}));
}

export function logOut(){
    localStorage.removeItem(KEY_SESSION);
}

export function isAuthed(): boolean{
    return Boolean(localStorage.getItem(KEY_SESSION));
}

export function getUserName(): string | null {
    const raw = localStorage.getItem(KEY_USER);
    if(!raw)
        return null;

    try{
        const user: User = JSON.parse(raw);
        return user.name ?? null;
    } catch {
        return null;
    }
}