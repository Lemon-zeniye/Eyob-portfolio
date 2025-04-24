import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function DatePickerDialog() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Open Dialog with Date Picker
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md"
          onInteractOutside={(e) => {
            if (
              e.target instanceof Element &&
              e.target.closest('[role="grid"]')
            ) {
              e.preventDefault();
            }
          }}
        >
          {/* ... rest of the dialog content ... */}
          <Popover.Root>
            <Popover.Content
              className="z-[1000] bg-white p-3 rounded-md shadow-lg border border-gray-200"
              sideOffset={5}
              avoidCollisions={false}
              onInteractOutside={(e) => {
                if (
                  e.target instanceof Element &&
                  e.target.closest('[role="grid"]')
                ) {
                  e.preventDefault();
                }
              }}
            >
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                role="application"
                // ... other props
              />
            </Popover.Content>
          </Popover.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
