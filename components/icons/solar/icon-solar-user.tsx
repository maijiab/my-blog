import React from 'react';

import { cn } from '@/lib/utils';

export const IconSolarUserHeartBold = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[solar--user-heart-bold]', className)}
    ></span>
  );
};
