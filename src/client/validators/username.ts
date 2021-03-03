export function validateUsername(username: string): Boolean {
    if(username.length < 1 || username.length > 25) {
        return false;
    } else {
        return true;
    }
}