# Linting & Type Checking Configuration

## ✅ What's Been Configured

### 1. **ESLint Configuration** (`eslint.config.mjs`)

Configured with strict rules to catch:

- ✅ Undefined variables (`no-undef`)
- ✅ Unused variables and imports (`@typescript-eslint/no-unused-vars`)
- ✅ React Hooks violations
- ✅ Promise handling issues
- ✅ TypeScript type issues

### 2. **TypeScript Configuration** (`tsconfig.json`)

Enhanced with additional checks:

- ✅ `noUnusedLocals` - Catch unused local variables
- ✅ `noUnusedParameters` - Catch unused function parameters
- ✅ `noImplicitReturns` - Ensure all code paths return a value
- ✅ `noFallthroughCasesInSwitch` - Catch switch fallthrough bugs
- ✅ `noUncheckedIndexedAccess` - Safer array/object access

### 3. **VS Code Settings** (`.vscode/settings.json`)

Auto-configured for:

- ✅ ESLint runs on file type/save
- ✅ Auto-fix on save
- ✅ Show TypeScript errors real-time
- ✅ Tailwind CSS IntelliSense

### 4. **Next.js Build Configuration** (`next.config.ts`)

- ✅ TypeScript errors will **fail the build**
- ✅ Strict type checking enabled

## 🚀 How to Use

### Check for errors before committing:

```bash
# Run type checking
npm run type-check

# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run both checks
npm run check
```

### During Development:

- **VS Code**: Errors will show inline and in the Problems panel
- **Terminal**: Run `npm run dev` - errors will show in the console
- **Browser**: TypeScript errors will show in the Next.js error overlay

## 📋 Common Errors & How to Fix

### ❌ "Variable is declared but never read"

**Problem**: Unused import or variable

```typescript
import { useState, useEffect } from "react"; // useEffect not used
```

**Fix**: Remove unused imports/variables

```typescript
import { useState } from "react";
```

### ❌ "'setError' is not defined"

**Problem**: Using a function/variable that doesn't exist

```typescript
setError("Something went wrong"); // setError not declared
```

**Fix**: Declare the variable with useState

```typescript
const [error, setError] = useState<string | null>(null);
setError("Something went wrong");
```

### ❌ "Property does not exist on type"

**Problem**: TypeScript can't verify the property exists

```typescript
const user = getUser();
user.name; // Error if getUser() returns User | null
```

**Fix**: Use optional chaining or type guards

```typescript
user?.name; // Safe access
```

## 🔧 Editor Setup

### Recommended VS Code Extensions:

1. **ESLint** - dbaeumer.vscode-eslint
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **TypeScript Next** - ms-vscode.vscode-typescript-next

Install all at once:

- Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
- Type "Extensions: Show Recommended Extensions"
- Click "Install All"

## ⚙️ Customizing Rules

### To disable a specific rule:

**In code (for one line):**

```typescript
// eslint-disable-next-line no-console
console.log("Debug info");
```

**In config (globally):**
Edit `eslint.config.mjs`:

```javascript
rules: {
  'no-console': 'off', // Disable the rule
}
```

### Rule severity levels:

- `'off'` or `0` - Turn off the rule
- `'warn'` or `1` - Show warning (doesn't break build)
- `'error'` or `2` - Show error (breaks build)

## 🎯 Best Practices

1. **Fix errors before committing** - Run `npm run check`
2. **Don't disable rules without team agreement**
3. **Use TypeScript types instead of `any`**
4. **Fix warnings gradually** - They become errors over time
5. **Enable auto-fix on save** in VS Code settings

## 📊 Pre-commit Hook (Optional)

To automatically check before commits, add to `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run check"
    }
  }
}
```

Then install husky:

```bash
npm install --save-dev husky
```

## 🐛 Troubleshooting

### ESLint not working in VS Code?

1. Restart VS Code
2. Run: `npm install`
3. Check Output panel → ESLint for errors

### TypeScript errors in VS Code different from terminal?

1. Run: `npm run type-check`
2. Reload VS Code window
3. Check you're using workspace TypeScript version

### Build fails but dev works?

- Development mode is more lenient
- Run `npm run check` to see all errors
- Fix before deploying
