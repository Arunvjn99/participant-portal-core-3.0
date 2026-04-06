import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function PostEnrollmentDashboardSkeleton() {
  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren>
      <div className="min-h-full bg-background pb-20">
        <div className="mx-auto max-w-[1280px] animate-pulse space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="h-8 w-40 rounded-lg bg-muted" />
            <div className="h-4 w-72 max-w-full rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-[340px] rounded-2xl bg-muted" />
              <div className="h-40 rounded-2xl bg-muted" />
              <div className="h-48 rounded-2xl bg-muted" />
              <div className="h-44 rounded-2xl bg-muted" />
              <div className="h-56 rounded-2xl bg-muted" />
              <div className="h-64 rounded-2xl bg-muted" />
            </div>
            <div className="space-y-6">
              <div className="h-72 rounded-2xl bg-muted" />
              <div className="h-64 rounded-2xl bg-muted" />
              <div className="h-56 rounded-2xl bg-muted" />
              <div className="h-80 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
