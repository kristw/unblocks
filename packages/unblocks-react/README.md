# @unblocks/react

A collection of React utilities

## Example usage

### createFlexibleContext

```ts
import { createFlexibleContext } from '@unblocks/react';

type UserProfile = ...;

export default function createUserProfileContext() {
    const { Context, useRequiredContext, useOptionalContext, checkContext } =
        createFlexibleContext<UserContext | undefined>();

    return {
        UserProfileContext: Context,
        useRequiredUserProfileContext: useRequiredContext,
        useOptionalUserProfileContext: useOptionalContext,
        checkUserProfileContext: checkContext,
    };
}
```
