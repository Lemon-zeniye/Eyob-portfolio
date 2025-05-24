import { Checkbox } from "@/components/ui/checkbox";
import { useRole } from "@/Context/RoleContext";
import { cn } from "@/lib/utils";

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
  const { mode } = useRole();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className={cn(
            mode === "formal"
              ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary/40"
              : "data-[state=checked]:bg-primary2 data-[state=checked]:border-primary2/40"
          )}
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
