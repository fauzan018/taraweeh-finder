import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";

export default function SupportPage() {
  return (
    <>
      <Navigation showFilters={false} />

      <main className="bg-background min-h-screen pb-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute top-16 right-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.3em] text-primary/70 font-semibold mb-4">
                Support The Project
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
                Keep Taraweeh Sweets Finder alive
              </h1>
              <p className="text-lg text-text-secondary">
                If this project helps you discover mosques and sweets during Ramadan, you can support
                the effort with a small UPI contribution.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
              <div className="relative group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70" />
                <div className="relative rounded-3xl border border-primary/30 bg-surface/70 backdrop-blur-xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-text-secondary">Scan to pay</p>
                      <h2 className="text-2xl font-semibold text-text-primary">UPI QR Code</h2>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Secure
                    </span>
                  </div>

                  <div className="relative rounded-2xl border border-border bg-white/10 p-5 sm:p-8 transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative aspect-square w-full max-w-md mx-auto">
                      <Image
                        src="/support/upi-qr.png"
                        alt="UPI QR code for fauzan@fam"
                        fill
                        className="object-contain rounded-xl"
                        sizes="(min-width: 1024px) 420px, (min-width: 640px) 70vw, 90vw"
                        priority
                      />
                    </div>
                  </div>

                  <p className="mt-6 text-sm text-text-secondary text-center">
                    Open your UPI app and scan the code to contribute.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-3">
                    Every bit helps
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Scan the QR with any UPI app to support the project directly.
                  </p>

                  <div className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-primary/70 font-semibold mb-2">
                      How it helps
                    </p>
                    <p className="text-base text-text-primary">
                      Support helps cover hosting and keeps the directory updated.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-text-secondary">
                    <p>Every contribution keeps the project accessible for the community.</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full rounded-xl border border-border bg-surface-light px-6 py-3 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-primary/50 hover:text-primary"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-surface/60 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center">
            <p className="text-text-secondary text-sm">
              Thank you for supporting Taraweeh Sweets Finder.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
