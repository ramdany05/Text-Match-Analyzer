import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Text Match Analyzer</CardTitle>
          <CardDescription>
            Analisis persentase kecocokan karakter antara dua teks.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Boilerplate siap digunakan. Fitur akan diimplementasikan di tahap selanjutnya.
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  );
}
