import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ADMIN_EMAILS } from '@/constants';
import slugify from "slugify";
import dayjs from "dayjs";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAdmin = (email?: string | null) => {
  if (!email || !ADMIN_EMAILS?.length) {
    return false;
  }
  return ADMIN_EMAILS.includes(email);
}

export const toSlug = (s: string) => {
  if (!s) {
    return "";
  }

  return slugify(s, {
    lower: true,
  });
};

export const copyToClipboard = (text: string) => {
  // 实测 Clipboard API 在 iPhone 上不支持，可恶！
  if (navigator.clipboard) {
    navigator.clipboard
      // 去除首尾空白字符
      .writeText(text?.trim())
      .then(() => {
        showSuccessToast("已复制到粘贴板");
      })
      .catch((error) => {
        showErrorToast(error as string);
      });
  } else {
    // 以下代码来自：https://www.zhangxinxu.com/wordpress/2021/10/js-copy-paste-clipboard/
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = "fixed";
    textarea.style.clip = "rect(0 0 0 0)";
    textarea.style.top = "10px";
    // 赋值，手动去除首尾空白字符
    textarea.value = text?.trim();
    // 选中
    textarea.select();
    // 复制
    document.execCommand("copy", true);
    showSuccessToast("已复制到粘贴板");
    // 移除输入框
    document.body.removeChild(textarea);
  }
};

export const toFromNow = (date: number | Date) => {
  return dayjs(date).locale("zh-cn");
};

export const toSlashDateString = (date: number | Date) => {
  return dayjs(date).locale("zh-cn").format("YYYY年M月D日 dddd HH:mm:ss");
};


export const isBrowser = () => {
  // 代码来自：https://ahooks.js.org/zh-CN/guide/blog/ssr
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
};