# Contributing
You can contribute if follow this simple rules. And this file will also contain the instruction to develop, build and contribute.

## Language
Only Typescript is accepted. No other language will be accepted.

## Code Style
Try using camelcase convention for naming variables.

❌ ```messageinputbox```

❌ ```message_input_box```

✔️ ```messageInputBox```

Name the variable according to what it is storing.
Example: To create an instance of screen object:
```typescript
let s = blessed.screen();  // bad name ❌
let screen = blessed.screen(); // good name ✔️
```

Don't place a huge amount of code into one single file. That looks kinda disgusting. Split code into different files.

Example:

```
This is how a utility or part of program should be splitted into files

- Root directory
  - index.ts // intializes the program
  - server // contains the code for server
    - index.ts // driver code for server
    - Routes // api routes
      - Auth // auth routes
        - index.ts // driver code
        - login.ts // handles logins
        - register.ts // handles register requests
        ...
  - client // contains the code for client side
    - index.ts // driver code
    - ui // ui code
      - index.ts // driver code
      ...


Not this

- Root directory
  - index.ts // handles all the argument parsing, contains the code for server and client
  ...
```