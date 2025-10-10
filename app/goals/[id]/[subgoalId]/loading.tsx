import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Skeleton className="h-4 w-32 mb-6" />

      <Card>
        <CardHeader>
          <Skeleton className="h-9 w-3/4 mb-2" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </CardHeader>
      </Card>
    </div>
  );
}
