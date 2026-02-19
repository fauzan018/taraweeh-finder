"use client";

import { MosqueSubmissionForm } from '@/components/MosqueSubmissionForm';

export default function AddMosque() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary mb-2">Add New Mosque</h1>
        <p className="text-text-secondary">Create a new mosque entry with location and taraweeh details</p>
      </div>
      <MosqueSubmissionForm />
    </div>
  );
}
