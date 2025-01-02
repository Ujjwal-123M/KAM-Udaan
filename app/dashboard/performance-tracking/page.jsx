import { PerformanceOverview } from "./_components/PerformanceOverview";
import { fetchPerformanceData } from "@/app/actions/fetchPerformanceData";

export default async function PerformancePage() {
  const performanceData = await fetchPerformanceData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Performance Tracking</h1>
      <PerformanceOverview data={performanceData} />
    </div>
  )
}

