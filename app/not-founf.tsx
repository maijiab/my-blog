import React from "react";
import Link from "next/link";
import { IllustrationNotFound } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/constants";

export default function Page() {
    return (
      <div className="h-screen grid place-items-center">
        <div className="grid gap-8">
          <IllustrationNotFound className="w-[320px] h-[320px]" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-center">
          页面未找到
        </h3>
        <Button asChild>
          <Link href={PATHS.SITE_HOME}>返回首页</Link>
        </Button>
      </div>
    );
}