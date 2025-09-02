import { z } from "zod";

// We use this to create the base user record
// later, we use this record to finish the onboarding process
export const UserSignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  picture: z.string().optional(),
  supabaseUserId: z.string(),
});

export type UserSignUp = z.infer<typeof UserSignUpSchema>;
