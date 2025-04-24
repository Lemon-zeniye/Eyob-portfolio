import { Card, CardContent } from "@/components/ui/card";
import { FC, ReactNode } from "react";

interface EmptyCardProps {
  children: ReactNode;
  contentClassname?: string;
  cardClassname?: string;
  onClick?: () => void;
}

const EmptyCard: FC<EmptyCardProps> = ({
  children,
  contentClassname,
  cardClassname,
  onClick,
}) => {
  return (
    <Card className={`${cardClassname}`}>
      <CardContent onClick={onClick} className={`${contentClassname} px-0`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default EmptyCard;
