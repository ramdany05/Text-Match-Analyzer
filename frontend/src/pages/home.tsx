import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

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
            Anda berhasil login. Fitur analisis teks akan diimplementasikan di tahap selanjutnya.
          </p>
          <div className="flex gap-2">
            <Button className="w-full">Get Started</Button>
            <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
