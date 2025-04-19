import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ReactNode } from "react";

interface ToolbarDropdownProps {
  children: ReactNode;
  button: ReactNode;
  classname: string;
}

const ToolbarDropdown = ({
  children,
  button,
  classname,
}: ToolbarDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>{button}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${classname}`}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToolbarDropdown;
