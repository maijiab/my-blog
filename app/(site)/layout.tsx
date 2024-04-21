import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";


export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-190px)]">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
