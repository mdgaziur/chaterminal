import { createInterface } from "readline";

export function syncreadline(question: string): Promise<string> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((res) => {
        rl.question(question, (answer: string) => {
            rl.close();
            res(answer);
        });
    });
}