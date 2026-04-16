import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container page-wrap">
      <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
        <div class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700">Privacy</div>
        <h1 class="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Privacy Policy</h1>
        <p class="mt-2 max-w-[90ch] text-sm leading-7 text-slate-600">
          EcomCropper is designed to be privacy-friendly. We don’t require login and we don’t build user profiles.
          Uploaded PDFs are used only to generate the processed output.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <a class="btn btn-primary" routerLink="/crop/flipkart">Use the Tool</a>
          <a class="btn" routerLink="/contact">Raise Request</a>
        </div>
      </div>

      <div class="mt-5 grid gap-4 lg:grid-cols-2">
        <div class="card rounded-2xl p-5">
          <h2 class="text-base font-extrabold text-slate-900">What we collect</h2>
          <p class="mt-2 text-sm leading-7 text-slate-600">
            Only what’s required to process your request (the uploaded PDF file) and return the output PDF.
          </p>
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
            <li>Uploaded label PDF (temporarily for processing)</li>
            <li>Basic request metadata (platform selection + options like invoice split)</li>
          </ul>
        </div>
        <div class="card rounded-2xl p-5">
          <h2 class="text-base font-extrabold text-slate-900">What we don’t do</h2>
          <p class="mt-2 text-sm leading-7 text-slate-600">We keep this tool simple and public.</p>
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
            <li>No login or account required</li>
            <li>No selling of user data</li>
            <li>No storing long-term user history in the browser or server by default</li>
          </ul>
        </div>
      </div>

      <div class="card mt-5 rounded-3xl p-6">
        <h2 class="text-lg font-extrabold tracking-tight text-slate-900">File handling</h2>
        <p class="mt-2 max-w-[90ch] text-sm leading-7 text-slate-600">
          Files are processed to generate the cropped output. After processing, you can download the output PDF.
          Your “Processing History” on crop pages is session-only UI in your browser.
        </p>
      </div>
    </section>
  `
})
export class PrivacyPageComponent {}
