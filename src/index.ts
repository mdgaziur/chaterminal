import { platform } from "os";
import useArgs from "./args";
import { log, type } from "./io/log";



(async () => {
    // do not run if os is not linux
    if(platform() !== 'linux') {
        log("Chaterminal only works on linux!", type.ERROR);
    }
    useArgs();
})();
