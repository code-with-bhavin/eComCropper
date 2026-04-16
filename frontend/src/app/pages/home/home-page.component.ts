import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container page-wrap">
      <div class="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
          <span class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700">
            Shipping Label Cropper
          </span>
          <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Crop and prepare e-commerce shipping labels from PDFs—instantly.
          </h1>
          <p class="mt-3 max-w-[62ch] text-base leading-7 text-slate-600">
            Pick your marketplace, upload the label PDF, click “Prepare Shipping Labels”, and download a clean, print-ready file in seconds. No
            login. No data saved.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a class="btn btn-primary" routerLink="/crop/flipkart">Crop Flipkart Labels</a>
            <a class="btn" routerLink="/crop/meesho">Crop Meesho Labels</a>
            <a class="btn" routerLink="/crop/amazon">Crop Amazon Labels</a>
          </div>
        </div>

        <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
          <div class="rounded-2xl bg-slate-900 px-5 py-5 text-slate-50">
            <div class="text-sm font-semibold text-slate-300">Works best for</div>
            <div class="mt-2 text-xl font-extrabold leading-snug tracking-tight">
              High-volume sellers who want fast, consistent label printing.
            </div>
            <div class="mt-3 text-sm leading-7 text-slate-300">
              Marketplace-first pages with a single, obvious flow: upload → prepare → download.
            </div>
          </div>
          <div class="mt-4 grid gap-3">
            <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
              <div class="inline-flex rounded-full border border-slate-900/10 bg-white px-3 py-1 text-sm font-extrabold text-slate-700">
                Unlimited
              </div>
              <div class="mt-2 text-sm leading-7 text-slate-600">Process multi-page label PDFs without limits.</div>
            </div>
            <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
              <div class="inline-flex rounded-full border border-slate-900/10 bg-white px-3 py-1 text-sm font-extrabold text-slate-700">
                Fast
              </div>
              <div class="mt-2 text-sm leading-7 text-slate-600">Optimized upload + processing feedback.</div>
            </div>
            <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
              <div class="inline-flex rounded-full border border-slate-900/10 bg-white px-3 py-1 text-sm font-extrabold text-slate-700">
                Privacy
              </div>
              <div class="mt-2 text-sm leading-7 text-slate-600">No login, no user history stored on our side.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-4 lg:grid-cols-3">
        <div
          class="overflow-hidden rounded-2xl border border-slate-900/10 bg-white/90 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
        >
          <div
            class="grid h-32 place-items-center bg-gradient-to-b from-slate-100 to-slate-200/90 [background-image:radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_55%),linear-gradient(180deg,rgba(243,244,246,0.96),rgba(229,231,235,0.92))]"
          >
            <img class="h-[88px] w-[88px] drop-shadow-lg" src="/platforms/Amazon_logo.png" alt="Amazon" loading="lazy" />
          </div>
          <div class="p-5">
            <h3 class="text-base font-extrabold text-slate-900">Amazon</h3>
            <p class="mt-2 text-sm leading-7 text-slate-600">
              Effortlessly streamline your Amazon shipping label preparation with our intuitive, one-click cropping solution.
            </p>
            <div class="mt-4">
              <a class="btn btn-primary w-full" routerLink="/crop/amazon">Crop Amazon Labels</a>
            </div>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-2xl border border-slate-900/10 bg-white/90 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
        >
          <div
            class="grid h-32 place-items-center bg-gradient-to-b from-slate-100 to-slate-200/90 [background-image:radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_55%),linear-gradient(180deg,rgba(243,244,246,0.96),rgba(229,231,235,0.92))]"
          >
            <img class="h-[88px] w-[88px] drop-shadow-lg" src="/platforms/Flipkart_logo.png" alt="Flipkart" loading="lazy" />
          </div>
          <div class="p-5">
            <h3 class="text-base font-extrabold text-slate-900">Flipkart</h3>
            <p class="mt-2 text-sm leading-7 text-slate-600">
              Effortlessly streamline your Flipkart shipping label preparation with our intuitive, one-click cropping solution.
            </p>
            <div class="mt-4">
              <a class="btn btn-primary w-full" routerLink="/crop/flipkart">Crop Flipkart Labels</a>
            </div>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-2xl border border-slate-900/10 bg-white/90 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
        >
          <div
            class="grid h-32 place-items-center bg-gradient-to-b from-slate-100 to-slate-200/90 [background-image:radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_55%),linear-gradient(180deg,rgba(243,244,246,0.96),rgba(229,231,235,0.92))]"
          >
            <img class="h-[88px] w-[88px] drop-shadow-lg" src="/platforms/Meesho_logo.png" alt="Meesho" loading="lazy" />
          </div>
          <div class="p-5">
            <h3 class="text-base font-extrabold text-slate-900">Meesho</h3>
            <p class="mt-2 text-sm leading-7 text-slate-600">
              Effortlessly streamline your Meesho shipping label preparation with our intuitive, one-click cropping solution.
            </p>
            <div class="mt-4">
              <a class="btn btn-primary w-full" routerLink="/crop/meesho">Crop Meesho Labels</a>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-5 rounded-3xl p-6">
        <h2 class="text-lg font-extrabold tracking-tight text-slate-900">Features</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
            <div class="font-extrabold text-slate-900">Unlimited</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Crop multiple pages in one go and keep moving with your packing workflow.</p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
            <div class="font-extrabold text-slate-900">Fast</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Upload → prepare → download with clear progress feedback.</p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
            <div class="font-extrabold text-slate-900">Secure</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">
              No login required. Your files are processed for output and not kept as user history.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
            <div class="font-extrabold text-slate-900">Download</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Instant output download as a print-ready PDF.</p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
            <div class="font-extrabold text-slate-900">User-friendly</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Simple UI designed for sellers—no manual PDF editing needed.</p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
            <div class="font-extrabold text-slate-900">Browser-based</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Works in your browser on any OS—no software install.</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent {}
