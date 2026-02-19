"use client";
import { useState } from "react";
import { Button } from "@/components/ui/UiButton";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/UiCard";
import { Toast } from "@/components/ui/Toast";
import { Select } from "@/components/ui/Select";
import { Plus, X } from "lucide-react";
import { INDIA_STATES } from "@/lib/constants";

interface MosqueSubmissionFormProps {
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
  submissionTarget?: "pending" | "approved";
}

export function MosqueSubmissionForm({
  onSuccess,
  onError,
  submissionTarget = "pending",
}: MosqueSubmissionFormProps) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    googleMapsLink: "",
    sweet_type: "",
    distribution_time: "",
    crowd_level: "",
  });
  const [taraweehDates, setTaraweehDates] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTaraweehDateChange = (index: number, value: string) => {
    const newDates = [...taraweehDates];
    newDates[index] = value;
    setTaraweehDates(newDates);
  };

  const addTaraweehDate = () => {
    setTaraweehDates([...taraweehDates, ""]);
  };

  const removeTaraweehDate = (index: number) => {
    if (taraweehDates.length > 1) {
      setTaraweehDates(taraweehDates.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      if (!form.name || !form.address || !form.city || !form.state || !form.sweet_type) {
        throw new Error("Please fill in all required fields");
      }
      // Submit via API route
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          taraweehDates,
          target: submissionTarget,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to submit mosque");
      setSuccessMessage(
        submissionTarget === "approved"
          ? `Mosque \"${form.name}\" was added successfully.`
          : `Thank you! Your mosque submission for \"${form.name}\" has been received and is pending review.`
      );
      setForm({
        name: "",
        address: "",
        city: "",
        state: "",
        googleMapsLink: "",
        sweet_type: "",
        distribution_time: "",
        crowd_level: "",
      });
      setTaraweehDates([""]);
      setTimeout(() => setSuccessMessage(null), 5000);
      if (onSuccess) onSuccess("Submission successful");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to submit mosque";
      setErrorMessage(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="xl" className="space-y-12 shadow-xl border border-border/60">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Location & Sweets Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 tracking-tight">Location & Sweets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input required label="Mosque Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Al-Salaam Mosque" />
            <Input required label="City" name="city" value={form.city} onChange={handleChange} placeholder="e.g., Lucknow" />
            <Select
              required
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              options={[
                { value: "", label: "Select a state" },
                ...INDIA_STATES.map((state) => ({ value: state, label: state })),
              ]}
            />
            <Input required label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Full address" />
            <Input label="Google Maps Link (Optional)" name="googleMapsLink" value={form.googleMapsLink} onChange={handleChange} placeholder="Paste any Google Maps link (short links supported)" />
            <Input required label="Sweet Type" name="sweet_type" value={form.sweet_type} onChange={handleChange} placeholder="e.g., Laddoo, Balushahi" />
          </div>
        </section>
        <div className="border-t border-border/60" />
        {/* Taraweeh Section */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 tracking-tight">Taraweeh Schedule</h2>
          <div className="space-y-4 mb-6">
            {taraweehDates.map((date, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {index === 0 ? "Taraweeh End Date" : `Session ${index + 1} End Date`}
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => handleTaraweehDateChange(index, e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                {taraweehDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTaraweehDate(index)}
                    className="p-2.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" onClick={addTaraweehDate} variant="secondary" size="md" className="w-full flex items-center justify-center gap-2 font-semibold">
            <Plus className="w-4 h-4" />
            Add Another Session
          </Button>
        </section>
        <div className="border-t border-border/60" />
        {/* Additional Information */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 tracking-tight">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Distribution Time (Optional)" name="distribution_time" value={form.distribution_time} onChange={handleChange} placeholder="e.g., After prayer" />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Expected Crowd Level (Optional)</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`px-4 py-2 rounded-lg border transition-all font-semibold text-sm focus:outline-none 
                      ${form.crowd_level === level
                        ? 'bg-primary text-surface-light border-primary shadow-md'
                        : 'bg-surface border-border text-text-primary hover:bg-primary/10'}`}
                    onClick={() => setForm({ ...form, crowd_level: form.crowd_level === level ? '' : level })}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="border-t border-border/60 pt-10">
          <Button type="submit" variant="primary" size="xl" fullWidth disabled={loading} className="font-bold text-lg py-4 tracking-wide border-2 border-primary shadow-xl rounded-xl transition-all duration-200 hover:scale-[1.03] hover:border-primary/80 focus:ring-2 focus:ring-primary/40 focus:outline-none">
            {loading ? "Submitting..." : "Submit Mosque"}
          </Button>
          <p className="text-xs text-text-secondary text-center mt-5">
            Your submission will be reviewed by our team before appearing in the directory.
          </p>
        </div>
      </form>
      {successMessage && (
        <Toast type="success" title="Submission Received" description={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
      {errorMessage && (
        <Toast type="error" title="Submission Failed" description={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
    </Card>
  );
}
