"use server";


import { ADMIN_EMAILS } from "@/constants";
import { type SignupDTO, signupSchema } from "@/features/auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const noPermission = async () => {
  const session = await auth();

  // 没有邮箱或者未配置admin邮箱，返回true，无权限
  if (!session?.user?.email || !ADMIN_EMAILS?.length) {
    return true;
  } else {
    // 如果当前用户邮箱存在admin邮箱中，返回false，说明有权限
    return !ADMIN_EMAILS.includes(session.user.email);
  }
};
