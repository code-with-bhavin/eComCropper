import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container page-wrap">
      <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700">About</div>
            <h1 class="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">EcomCropper</h1>
            <p class="mt-2 max-w-[78ch] text-sm leading-7 text-slate-600">
              EcomCropper is a browser-based tool for e-commerce sellers to automatically crop and prepare shipping label PDFs for quick, accurate printing.
              It’s designed to be fast, simple, and privacy-friendly.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a class="btn btn-primary" routerLink="/crop/flipkart">Start Cropping</a>
            <a class="btn" routerLink="/privacy">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-4 lg:grid-cols-3">
        <div class="card rounded-2xl p-5">
          <h2 class="text-base font-extrabold text-slate-900">No login</h2>
          <p class="mt-2 text-sm leading-7 text-slate-600">Open the site, upload your label PDF, download output—no account needed.</p>
        </div>
        <div class="card rounded-2xl p-5">
          <h2 class="text-base font-extrabold text-slate-900">Marketplace-first</h2>
          <p class="mt-2 text-sm leading-7 text-slate-600">Dedicated crop pages per platform so the flow stays focused and simple.</p>
        </div>
        <div class="card rounded-2xl p-5">
          <h2 class="text-base font-extrabold text-slate-900">Seller-friendly</h2>
          <p class="mt-2 text-sm leading-7 text-slate-600">Designed for high-volume printing workflows with minimal clicks.</p>
        </div>
      </div>

      <div class="card mt-5 rounded-3xl p-6">
        <h2 class="text-lg font-extrabold tracking-tight text-slate-900">How it works</h2>
        <div class="mt-4 grid gap-4 lg:grid-cols-3">
          <div class="rounded-2xl border border-slate-900/10 bg-blue-50/60 px-5 py-4">
            <div class="text-sm font-extrabold text-slate-900">1) Choose platform</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Open Meesho / Flipkart / Amazon crop page.</p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-blue-50/60 px-5 py-4">
            <div class="text-sm font-extrabold text-slate-900">2) Upload PDF</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Select your shipping label PDF.</p>
          </div>
          <div class="rounded-2xl border border-slate-900/10 bg-blue-50/60 px-5 py-4">
            <div class="text-sm font-extrabold text-slate-900">3) Prepare & download</div>
            <p class="mt-2 text-sm leading-7 text-slate-600">Click “Prepare Shipping Labels” and download output.</p>
          </div>
        </div>
      </div>

      <div class="card mt-5 rounded-3xl p-6">
        <h2 class="text-lg font-extrabold tracking-tight text-slate-900">Need another marketplace?</h2>
        <p class="mt-2 max-w-[86ch] text-sm leading-7 text-slate-600">
          If you want support for Ajio / Snapdeal / Myntra / other custom formats, raise a request with sample labels.
        </p>
        <div class="mt-4">
          <a class="btn btn-primary" routerLink="/contact">Raise Request</a>
        </div>
      </div>
    </section>
  `
})
export class AboutPageComponent {}
