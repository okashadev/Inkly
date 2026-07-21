import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import React from 'react'

const Spinner = ({ className, ...props }: React.ComponentProps<"svg">) => {
  return (
    <>
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
    </>
  )
}

export default Spinner
