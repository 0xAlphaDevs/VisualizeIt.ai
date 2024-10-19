import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <main className="px-10 py-4">
        {children}
      </main>
    </div>
  );
}