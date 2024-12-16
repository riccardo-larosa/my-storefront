"use server";

import { z } from "zod";
import { getServerSideImplicitClient } from "../../../lib/epcc-server-side-implicit-client";
import { redirect } from "next/navigation";
import { getErrorMessage } from "../../../lib/get-error-message";

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const PASSWORD_PROFILE_ID = process.env.NEXT_PUBLIC_PASSWORD_PROFILE_ID!;
const AUTHENTICATION_REALM_ID = process.env.NEXT_PUBLIC_AUTHENTICATION_REALM_ID!;

export async function resetPassword(formData: FormData) {
  const client = getServerSideImplicitClient();

  const rawEntries = Object.fromEntries(formData.entries());
  const validatedProps = resetPasswordSchema.safeParse(rawEntries);

  if (!validatedProps.success) {
    return {
      error: validatedProps.error.errors[0].message,
    };
  }

  const { token, newPassword } = validatedProps.data;

  try {
    await client.request.send(
      `/authentication-realms/${AUTHENTICATION_REALM_ID}/password-profiles/${PASSWORD_PROFILE_ID}/password-reset`,
      "POST",
      {
        data: {
          type: "password_reset",
          token,
          password: newPassword,
        },
      },
      undefined,
      client,
      false,
      "v2"
    );

    redirect("/login?message=Password+reset+successful");
  } catch (error) {
    console.error(getErrorMessage(error));
    return {
      error: "Failed to reset password. Please try again.",
    };
  }
} 