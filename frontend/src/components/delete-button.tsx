import clsx from 'clsx';
import React, { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from './ui/button';

export const DeleteButton = ({
  onDelete: _onDelete,
  className,
  tooltip,
  place,
}: {
  onDelete: () => Promise<void>;
  className?: string;
  tooltip?: string;
  place?: string;
}) => {
  const [deleting, setDeleting] = useState(false);
  const onDelete = async () => {
    setDeleting(true);
    await _onDelete();
    setDeleting(false);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDelete()}
      className={clsx(className)}
    >
      {deleting ? (
        <Icons.spinner className="animate-spin size-4" />
      ) : (
        <Icons.trash className="size-4" />
      )}
    </Button>
  );
};
