import { cn } from '@/lib/utils';
import { OptionProps } from './option';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type CheckOptionProps = {
  defaultValue?: boolean;
} & OptionProps;

export const CheckOption = ({
  data,
  label,
  name,
  onValueChange,
}: CheckOptionProps) => {
  return (
    <div className={cn('flex justify-start items-center gap-2 text-sm')}>
      <Checkbox
        id={name}
        checked={data?.[name] ?? false}
        onCheckedChange={(checked) =>
          onValueChange && onValueChange(name, checked)
        }
        className="bg-transparent rounded"
      />
      <Label className="whitespace-nowrap" htmlFor={name}>
        {label}
      </Label>
    </div>
  );
};
