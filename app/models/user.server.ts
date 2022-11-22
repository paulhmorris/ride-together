import type { Password, PasswordReset, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

import { prisma } from "~/lib/db.server";
import { sendPasswordResetEmail } from "~/lib/email.server";

export type { User } from "@prisma/client";

export function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      role: "USER",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function resetPassword(
  token: PasswordReset["token"],
  userId: User["id"],
  password: string
) {
  // Validate token
  const dbToken = await prisma.passwordReset.findFirst({ where: { token } });
  if (!dbToken) throw new Error("Invalid token");

  // Validate that found token belongs to user who received email
  if (dbToken.userId !== userId) throw new Error("User ids do not match");

  // Make sure token isn't expired
  const isExpired = new Date().getTime() > dbToken?.expiresAt.getTime();
  if (isExpired) throw new Error("Token expired");

  // Update password
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { id: dbToken.userId },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export function updateUser(data: Partial<User>) {
  return prisma.user.update({
    where: { id: data.id },
    data: data,
  });
}

export function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function sendPasswordReset(email: User["email"]) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const reset = await prisma.passwordReset.create({
      data: {
        userId: user.id,
        expiresAt: dayjs().add(1, "day").toDate(),
      },
    });
    // Send reset email to user
    return sendPasswordResetEmail(reset.token, user.id);
  }
}
