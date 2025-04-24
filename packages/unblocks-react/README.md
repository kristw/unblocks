# @unblocks/react

A collection of React utilities

## Example usage

### createFlexibleContext()

```ts
// UserProfileContext.ts

import { createFlexibleContext } from '@unblocks/react';

export type UserProfile = ...;

// Create the context and hooks
const { Context, useRequiredContext, useOptionalContext, checkContext } =
    createFlexibleContext(defaultValue, {
        contextName: 'UserProfileContext',
        providerTag: 'UserProfileContext.Provider',
    });

// Then export with more specific names
export {
    Context as UserProfileContext,
    useRequiredContext as useRequiredUserProfileContext,
    useOptionalContext as useOptionalUserProfileContext,
    checkContext as checkUserProfileContext,
}
```

Then use

```tsx
// App.tsx

import { UserProfileContext } from './UserProfileContext';
import Component from './Component';

export default function App() {
    return (
        <UserProfileContext.Provider value={userProfile}>
            <Component>...</Component>
        </UserProfileContext.Provider>
    );
}
```

```tsx
// Component.tsx
import { useRequiredUserProfileContext } from './UserProfileContext';

export default function Component() {
    const userProfile = useRequiredUserProfileContext();

    return <div>{userProfile.name}</div>;
}
```
