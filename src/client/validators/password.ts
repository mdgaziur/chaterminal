export function validatePassword(password: string): Boolean {
    if(password.length < 8 || password.length > 100) {
        return false;
    }
    return true;
}