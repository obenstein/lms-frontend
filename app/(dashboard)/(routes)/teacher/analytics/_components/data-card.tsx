import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface dataCardProps {
  value: number;
  label: string;
}

export const DataCard = ({ label, value }: dataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
