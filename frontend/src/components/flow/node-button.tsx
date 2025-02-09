import { NodeList } from './node-list';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const NodeButton = ({ className, onAddNode, ...props }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={cn(className)}
          {...props}
        >
          <Icons.add className="w-4 h-4" />
          Add Node
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col p-0 w-80 h-[calc(100vh-var(--header-height)-4rem)]">
        <ScrollArea className="flex-1 min-h-0">
          <NodeList onAddNode={onAddNode} />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
