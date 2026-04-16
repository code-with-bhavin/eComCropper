import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdsenseService } from './adsense.service';

@Component({
  selector: 'app-ad-slot',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="enabled; else placeholder">
      <ins
        class="adsbygoogle"
        [style.display]="display"
        [style.width]="width"
        [style.height]="height"
        [attr.data-ad-client]="clientId"
        [attr.data-ad-slot]="slot"
        [attr.data-ad-format]="format"
        [attr.data-full-width-responsive]="fullWidthResponsive ? 'true' : null"
      ></ins>
    </ng-container>

    <ng-template #placeholder>
      <div class="rounded-2xl border border-slate-900/10 bg-white/80 p-3 text-xs font-semibold text-slate-500">
        Ad slot placeholder (set AdSense client + slot IDs)
      </div>
    </ng-template>
  `
})
export class AdSlotComponent implements AfterViewInit {
  @Input({ required: true }) slot = '';
  @Input() format: 'auto' | 'rectangle' | string = 'auto';
  @Input() fullWidthResponsive = true;

  // Sizing helps prevent layout shift for side rails.
  @Input() display = 'block';
  @Input() width = '160px';
  @Input() height = '600px';

  constructor(private readonly adsense: AdsenseService) {}

  get clientId(): string {
    return this.adsense.clientId;
  }

  get enabled(): boolean {
    return Boolean(this.clientId && this.slot);
  }

  ngAfterViewInit(): void {
    if (!this.enabled) return;
    this.adsense.ensureScriptLoaded();
    this.adsense.requestAd();
  }
}

