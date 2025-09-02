# Authentication with Supabase

This API uses Supabase for authentication with a custom tRPC middleware that validates JWT tokens and adds user details to the context.

## Setup

### Environment Variables

Add these environment variables to your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Schema

The User model includes a `supabaseUserId` field to link Supabase users with our database records:

```typescript
export const UserSchema = BaseSchema.extend({
  accountId: z.string(),
  name: z.string(),
  email: z.string().email(),
  supabaseUserId: z.string(), // Links to Supabase user ID
  devices: z.array(DeviceSchema),
});
```

## How It Works

### 1. Token Validation

When a request is made to a protected endpoint, the middleware:

1. Extracts the `Authorization: Bearer <token>` header
2. Validates the JWT token with Supabase
3. Looks up the user in our database using the Supabase user ID
4. Adds user details to the tRPC context

### 2. Context Types

The middleware provides three types of procedures:

- **`publicProcedure`**: No authentication required
- **`protectedProcedure`**: Requires valid authentication
- **`optionalAuthProcedure`**: Authentication optional, user may be null

### 3. User Context

When authenticated, the context includes:

```typescript
interface AuthContext {
  user: {
    id: string; // Database user ID
    email: string; // User email
    name: string; // User name
    accountId: string; // Associated account ID
    supabaseUserId: string; // Supabase user ID
  } | null;
}
```

## Usage Examples

### Protected Endpoint

```typescript
export const appRouter = router({
  getToken: protectedProcedure.output(TokenResponseSchema).query(({ ctx }) => {
    // ctx.user is guaranteed to exist here
    const token = new AccessToken(
      // ... token config
      { identity: ctx.user.name, region: "au1" }
    );

    return {
      token: token.toJwt(),
      identity: ctx.user.name,
      numbers,
    };
  }),
});
```

### Optional Authentication

```typescript
export const appRouter = router({
  getAgentStatus: optionalAuthProcedure
    .input(z.object({ identity: z.string() }))
    .query(({ input, ctx }) => {
      // ctx.user may be null
      if (ctx.user) {
        console.log(`User ${ctx.user.name} checking status`);
      }
      return agentStatusMap.get(input.identity) || "offline";
    }),
});
```

### Public Endpoint

```typescript
export const appRouter = router({
  userSignUp: publicProcedure
    .input(UserSignUpSchema)
    .mutation(async ({ input }) => {
      // No authentication required
      const user = await UserModel.create({
        // ... user data
        supabaseUserId: input.supabaseUserId,
      });
      return { success: true };
    }),
});
```

## Client Usage

### Setting Authorization Header

```typescript
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
      headers: {
        authorization: `Bearer ${supabaseToken}`,
      },
    }),
  ],
});

// Now all requests will include the auth header
const tokenData = await trpc.getToken.query();
const currentUser = await trpc.getCurrentUser.query();
```

### React Query with tRPC

```typescript
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./router";

export const trpc = createTRPCReact<AppRouter>();

// In your app provider
<QueryClient client={queryClient}>
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <App />
  </trpc.Provider>
</QueryClient>;
```

## Error Handling

### Unauthorized Access

When accessing a protected endpoint without valid authentication:

```typescript
// Returns TRPCError with code "UNAUTHORIZED"
const result = await trpc.getToken.query();
// Error: "You must be logged in to access this resource"
```

### Invalid Token

When providing an invalid or expired token:

```typescript
// The middleware will return { user: null }
// Protected procedures will throw UNAUTHORIZED
// Optional procedures will continue with user: null
```

## Security Notes

1. **Service Role Key**: The middleware uses Supabase's service role key for token validation. Keep this secure.
2. **Token Expiration**: JWT tokens have expiration times. Handle token refresh on the client side.
3. **Database Lookup**: Each request performs a database lookup. Consider caching for performance.
4. **Error Logging**: Failed authentication attempts are logged for debugging.

## Testing

### With Valid Token

```bash
curl -H "Authorization: Bearer your_valid_token" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3001/trpc/getCurrentUser
```

### Without Token

```bash
curl -H "Content-Type: application/json" \
     -X POST http://localhost:3001/trpc/getCurrentUser
# Returns UNAUTHORIZED error
```
