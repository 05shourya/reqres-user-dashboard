# User Dashboard App

## Live Demo

The app is hosted on Netlify: [https://reqres-user-dashboard.netlify.app/](https://reqres-user-dashboard.netlify.app/)

This application uses the [ReqRes API](https://reqres.in/) to simulate login and display users. It consists of two pages:

1. **Login Page**:

    - Users must login with the following credentials (mock API):
        - Email: `eve.holt@reqres.in`
        - Password: `cityslicka`
    - Upon successful login, users are redirected to the User Page.

2. **User Page**:
    - Displays users beautifully with pagination and search features.

## Installation and Running

1. Clone this repository
2. Install dependencies:
    ```
    npm install
    ```
3. Run the app:
    ```
    npm start
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        "react-x": reactX,
        "react-dom": reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs["recommended-typescript"].rules,
        ...reactDom.configs.recommended.rules,
    },
});
```
