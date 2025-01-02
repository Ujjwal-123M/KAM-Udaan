import InteractionsPerLead from "./_components/InteractionsPerLead";
import InteractionsList from "./_components/InteractionsList";
import CallScheduler from "./_components/call-scheduler";
import CallReminders from "./_components/call-reminders";

export default function InteractionsRecordsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Interactions Records</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col space-y-6">
          <InteractionsPerLead />
          <InteractionsList />
        </div>
        {/* Right Column */}
        <div className="flex flex-col space-y-6">
          <CallReminders />
          <CallScheduler />
        </div>
      </div>
    </div>
  );
}
