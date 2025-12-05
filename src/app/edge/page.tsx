import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Home() {
  const host = (await headers()).get("host") ?? "";

  // Redirect to GitHub profile if accessed through github subdomain
  if (host.startsWith("github.")) {
    redirect("https://github.com/zPleum");
  }

  // Redirect to Facebook profile if accessed through facebook subdomain
  if (host.startsWith("facebook.")) {
    redirect("https://www.facebook.com/wiraphat.makwong");
  }

  // Redirect to Discord profile if accessed through discord subdomain
  if (host.startsWith("discord.")) {
    redirect("https://discord.com/users/837918998242656267");
  }

  // Redirect to Email if accessed through mail subdomain
  if (host.startsWith("mail.")) {
    redirect("mailto:wiraphat.makwong@gmail.com");
  }

  const title = "zPleum";
  const content = "Full Stack Developer";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <main className="w-full max-w-lg mx-auto px-4 sm:px-6 md:px-8">
          <div
            className="py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-12 rounded-xl sm:rounded-2xl backdrop-blur-sm shadow-lg"
            style={{
              backgroundColor: "var(--surface-background)",
              border: "1px solid var(--neutral-border-alpha-medium)"
            }}
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--neutral-on-background-strong)]">{title}</h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-[var(--neutral-on-background-weak)]">{content}</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
