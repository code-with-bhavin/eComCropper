import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="container page-wrap">
      <div class="card rounded-3xl p-6">
        <div class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700">Support</div>
        <h1 class="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Raise Request</h1>
        <p class="mt-2 max-w-[80ch] text-sm leading-7 text-slate-600">
          Request support for a new marketplace, custom label format, or report a crop issue. We don’t store your files—please attach sample labels
          when you email us.
        </p>

        <div class="mt-5 grid gap-4">
          <label class="grid gap-1.5">
            <span class="text-sm font-bold text-slate-900">Platform</span>
            <select class="btn justify-start text-left" [(ngModel)]="platform">
              <option value="meesho">Meesho</option>
              <option value="flipkart">Flipkart</option>
              <option value="amazon">Amazon</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label class="grid gap-1.5">
            <span class="text-sm font-bold text-slate-900">Your email (optional)</span>
            <input class="btn justify-start text-left" type="email" [(ngModel)]="fromEmail" placeholder="you@example.com" />
          </label>

          <label class="grid gap-1.5">
            <span class="text-sm font-bold text-slate-900">Details</span>
            <textarea
              class="btn min-h-[140px] justify-start text-left"
              style="resize: vertical;"
              [(ngModel)]="details"
              placeholder="Example: Need Ajio label crop support. Single + batch labels. Please keep invoice on separate page."
            ></textarea>
          </label>

          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a class="btn btn-primary" [href]="mailtoLink">Send Email</a>
            <a class="btn" routerLink="/">Back to Home</a>
            <span class="text-sm text-slate-500">Support email: <strong class="text-slate-700">{{ supportEmail }}</strong></span>
          </div>

          <div class="text-sm leading-7 text-slate-500">
            Tip: Attach 1–2 sample label PDFs in the email so we can add or improve the crop rules quickly.
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactPageComponent {
  supportEmail = 'support@ecomcropper.example';

  platform: 'meesho' | 'flipkart' | 'amazon' | 'other' = 'other';
  fromEmail = '';
  details = '';

  constructor(route: ActivatedRoute) {
    const q = (route.snapshot.queryParamMap.get('platform') ?? '').toLowerCase();
    if (q === 'meesho' || q === 'flipkart' || q === 'amazon') {
      this.platform = q;
    }
  }

  get mailtoLink(): string {
    const subject = `EcomCropper request - ${this.platform}`;
    const body = [
      `Platform: ${this.platform}`,
      this.fromEmail ? `From: ${this.fromEmail}` : undefined,
      '',
      this.details || '(Add your requirement here)',
      '',
      'Please attach sample label PDFs to this email.'
    ]
      .filter((line): line is string => Boolean(line))
      .join('\n');

    return `mailto:${encodeURIComponent(this.supportEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
