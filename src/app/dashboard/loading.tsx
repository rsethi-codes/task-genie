import DashboardLayout from "@/components/dashboard/layout";

export default function DashboardLoading() {
  return (
    <DashboardLayout user={{ fullName: null }}>
      <div className="space-y-12">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-surface rounded-xl animate-pulse" />
          <div className="h-6 w-96 bg-surface rounded-lg animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-surface rounded-2xl animate-pulse" />
          <div className="h-64 bg-surface rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-surface rounded-lg animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
