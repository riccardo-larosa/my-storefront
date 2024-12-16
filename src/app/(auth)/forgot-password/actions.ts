"use server";

import { z } from "zod";
import { getServerSideImplicitClient } from "../../../lib/epcc-server-side-implicit-client";
import { getErrorMessage } from "../../../lib/get-error-message";

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

const PASSWORD_PROFILE_ID = process.env.NEXT_PUBLIC_PASSWORD_PROFILE_ID!;
const AUTHENTICATION_REALM_ID = process.env.NEXT_PUBLIC_AUTHENTICATION_REALM_ID!;

export async function requestPasswordReset(formData: FormData) {
  const client = getServerSideImplicitClient();

  const rawEntries = Object.fromEntries(formData.entries());
  const validatedProps = requestPasswordResetSchema.safeParse(rawEntries);

  if (!validatedProps.success) {
    return {
      error: "Please enter a valid email address",
    };
  }

  const { email } = validatedProps.data;

  try {
    await client.request.send(
      `/authentication-realms/${AUTHENTICATION_REALM_ID}/password-profiles/${PASSWORD_PROFILE_ID}/one-time-password-token-request`,
      "POST",
      {
        data: {
          type: "one_time_password_token_request",
          username: email.toLowerCase(),
          purpose: "reset_password",
        },
      },
      undefined,
      client,
      false,
      "v2"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(getErrorMessage(error));
    return {
      error: "Failed to send reset instructions. Please try again.",
    };
  }
} 