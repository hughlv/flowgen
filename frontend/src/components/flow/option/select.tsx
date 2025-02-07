import clsx from 'clsx';
import { OptionProps } from './option';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';

type SelectOptionProps = {
  options: { label: string; value: string; disabled?: boolean }[];
  disabled?: boolean;
} & OptionProps;

export const SelectOption = ({
  data,
  label,
  name,
  onValueChange,
  options,
  compact,
  disabled,
}: SelectOptionProps) => {
  const currentValue = data?.[name];
  const currentOption = options.find((o) => o.value === currentValue);

  return (
    <div
      className={clsx('flex gap-2 text-sm', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <Label className="whitespace-nowrap">{label}</Label>
      <Select
        value={currentValue}
        onValueChange={(value) => onValueChange && onValueChange(name, value)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select option">
            {currentOption?.label || 'Select option'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((o, i) => (
            <SelectItem key={i} value={o.value} disabled={o.disabled}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
