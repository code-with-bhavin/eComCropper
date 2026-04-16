import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

@Injectable({ providedIn: 'root' })
export class AdsenseService {
  private scriptLoaded = false;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  get clientId(): string {
    return environment.adsense?.client ?? '';
  }

  ensureScriptLoaded(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.clientId) return;
    if (this.scriptLoaded) return;

    const existing = this.document.querySelector(`script[data-adsense-client="${this.clientId}"]`);
    if (existing) {
      this.scriptLoaded = true;
      return;
    }

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(this.clientId)}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-adsense-client', this.clientId);
    this.document.head.appendChild(script);
    this.scriptLoaded = true;
  }

  requestAd(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.clientId) return;
    (window.adsbygoogle ??= []).push({});
  }
}

