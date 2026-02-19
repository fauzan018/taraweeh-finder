"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { Navigation } from "@/components/Navigation";
import { Plus, X, CheckCircle, AlertCircle } from "lucide-react";

export default function SubmitMosquePage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    googleMapsLink: "",
    sweet_type: "",
    distribution_time: "",
    crowd_level: "",
  });
  const [taraweehDates, setTaraweehDates] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clean handleChange: no lat/lng logic
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
      // Validate form: require name, address, state, city, sweet_type, and a valid Google Maps link
      if (!form.name || !form.address || !form.state || !form.city || !form.sweet_type || !form.googleMapsLink) {
        throw new Error("Please fill in all required fields, including a valid Google Maps link and sweet type");
      }

      // Insert mosque submission
      const { data: submission, error: submissionError } = await supabase
        .from("mosque_submissions")
        .insert([{ 
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          // No lat/lng, handled via Google Maps link only
          sweet_type: form.sweet_type,
          distribution_time: form.distribution_time,
          crowd_level: form.crowd_level,
          status: 'pending',
          taraweeh_end_date: taraweehDates[0],
        }])
        .select();

      if (submissionError) throw submissionError;

      setSuccessMessage(`Thank you! Your mosque submission for "${form.name}" has been received and is pending review.`);
      
      setForm({
        name: "",
        address: "",
        state: "",
        city: "",
        googleMapsLink: "",
        sweet_type: "",
        distribution_time: "",
        crowd_level: "",
      });
      setTaraweehDates([""]);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to submit mosque";
      setErrorMessage(errorMsg);
      console.error("Error submitting mosque:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="bg-background min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-14 flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 mb-5">
              <span className="text-3xl">🕌</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-text-primary mb-4 leading-tight">Submit a Mosque</h1>
            <p className="text-lg text-text-secondary max-w-xl font-medium">
              Help the community find taraweeh sessions and refreshment details at your local mosque during Ramadan.
            </p>
          </div>

          {/* Form Card */}
          <Card variant="elevated" padding="xl" className="space-y-12 shadow-xl border border-border/60">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Location & Sweets Section */}
              <section>
                <h2 className="text-2xl font-bold text-text-primary mb-8 tracking-tight">Location & Sweets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    required
                    label="Mosque Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Al-Salaam Mosque"
                  />
                  <Input
                    required
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g., Delhi"
                  />
                  <Input
                    required
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g., Delhi"
                  />
                  <Input
                    required
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full address"
                  />
                  <Input
                    required
                    label="Google Maps Link"
                    name="googleMapsLink"
                    value={form.googleMapsLink}
                    onChange={handleChange}
                    placeholder="Paste Google Maps link here"
                  />
                  <Input
                    required
                    label="Sweet Type"
                    name="sweet_type"
                    value={form.sweet_type}
                    onChange={handleChange}
                    placeholder="e.g., Laddoo, Balushahi"
                  />
                </div>
              </section>

              {/* Divider */}
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
                <Button
                  type="button"
                  onClick={addTaraweehDate}
                  variant="secondary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Session
                </Button>
              </section>

              {/* Divider */}
              <div className="border-t border-border/60" />

              {/* Additional Information */}
              <section>
                <h2 className="text-2xl font-bold text-text-primary mb-8 tracking-tight">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Distribution Time (Optional)"
                    name="distribution_time"
                    value={form.distribution_time}
                    onChange={handleChange}
                    placeholder="e.g., After prayer"
                  />
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

              {/* Submit Button */}
              <div className="border-t border-border/60 pt-10">
                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  fullWidth
                  disabled={loading}
                  className="font-bold text-lg py-4 tracking-wide border-2 border-primary shadow-xl rounded-xl transition-all duration-200 hover:scale-[1.03] hover:border-primary/80 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  {loading ? "Submitting..." : "Submit Mosque"}
                </Button>
                <p className="text-xs text-text-secondary text-center mt-5">
                  Your submission will be reviewed by our team before appearing in the directory.
                </p>
              </div>
            </form>
          </Card>

          {/* Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="glass" padding="xl" className="flex flex-col items-center text-center gap-2">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-text-primary text-lg mb-1">Quick Review</h3>
              <p className="text-sm text-text-secondary">Your submission is reviewed within 24 hours</p>
            </Card>
            <Card variant="glass" padding="xl" className="flex flex-col items-center text-center gap-2">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-semibold text-text-primary text-lg mb-1">Community Driven</h3>
              <p className="text-sm text-text-secondary">Help thousands find taraweeh sessions</p>
            </Card>
            <Card variant="glass" padding="xl" className="flex flex-col items-center text-center gap-2">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-text-primary text-lg mb-1">Privacy Protected</h3>
              <p className="text-sm text-text-secondary">Your information is kept confidential</p>
            </Card>
          </div>
        </div>

        {/* Toast Notifications */}
        {successMessage && (
          <Toast
            type="success"
            title="Submission Received"
            description={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {errorMessage && (
          <Toast
            type="error"
            title="Submission Failed"
            description={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
      </main>
    </>
  );
}
