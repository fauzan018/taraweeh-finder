import { MosqueSubmissionForm } from '@/components/MosqueSubmissionForm';

export default function SubmitMosquePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary mb-2">Submit a Mosque</h1>
        <p className="text-text-secondary">Submit a mosque for public listing with location and taraweeh details</p>
      </div>
      <MosqueSubmissionForm />
    </div>
  );
}
