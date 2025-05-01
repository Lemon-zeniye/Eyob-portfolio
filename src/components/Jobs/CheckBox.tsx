import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxWithLabelProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxWithLabel({
  id,
  label,
  checked,
  onChange,
  disabled,
}: CheckboxWithLabelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <label
          htmlFor={id}
          className="eading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
    </div>
  );
}
