import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center w-full text-center">
        <h1 className="text-7xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-base text-[var(--neutral-on-background-weak)]">
          The page you are looking for does not exist.
        </p>
      </div>
      <Footer />
    </div>
  );
} 