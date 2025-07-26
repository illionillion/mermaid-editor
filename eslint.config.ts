import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "docs/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly"
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "import": importPlugin,
      "unused-imports": unusedImports,
      "react": react,
      "react-hooks": reactHooks,
    },
    rules: {
      // 文字列は""で統一
      "quotes": ["error", "double", { "avoidEscape": true }],
      
      // JSX内も""で統一
      "jsx-quotes": ["error", "prefer-double"],
      
      // importは昇順
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          },
          "newlines-between": "never"
        }
      ],
      
      // 未使用のimportは削除
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],
      
      // JSXで{""}は許さない
      "react/jsx-curly-brace-presence": [
        "error",
        {
          "props": "never",
          "children": "never",
          "propElementValues": "always"
        }
      ],
      
      // React関連の基本ルール
      "react/react-in-jsx-scope": "off", // Next.jsでは不要
      "react/prop-types": "off", // TypeScriptを使用するため
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // TypeScript関連
      "@typescript-eslint/no-unused-vars": "off", // unused-importsが処理
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Import関連
      "import/no-unresolved": "off", // TypeScriptが処理
      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      
      // 一般的なベストプラクティス
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true
        }
      }
    }
  }
);
