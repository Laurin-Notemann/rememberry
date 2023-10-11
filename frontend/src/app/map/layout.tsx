import Sidebar from "@/components/Sidebar/Sidebar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative">
      <div className="hidden  h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-blue-500 right-shadow">
        <Sidebar />
      </div>
      {/* MapLayout will receive several React nodes as children that will be rendered in place here */}
      {children}
    </div>
  );
}