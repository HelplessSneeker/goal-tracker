import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            A sign in link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-600">
          <p>Click the link in the email to sign in to your account.</p>
          <p className="mt-2">
            You can close this window and check your email inbox.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
