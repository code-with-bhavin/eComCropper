import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PdfService, PlatformType } from '../../services/pdf.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [
    `
      .shell {
        display: grid;
        gap: 1.25rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.94fr);
        gap: 1.25rem;
      }

      .hero-card,
      .tool-card {
        padding: 1.55rem;
        border-radius: 28px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background:
          radial-gradient(circle at top right, var(--platform-wash), transparent 34%),
          linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,247,251,0.95));
        box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);
      }

      .eyebrow {
        display: inline-flex;
        padding: 0.34rem 0.72rem;
        border-radius: 999px;
        background: color-mix(in srgb, var(--platform-accent) 14%, white);
        color: var(--platform-accent-deep);
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .market-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .market-link {
        text-decoration: none;
        padding: 0.65rem 0.92rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(15, 23, 42, 0.08);
        color: #52606d;
        font-weight: 700;
      }

      .market-link.active {
        background: linear-gradient(135deg, var(--platform-accent), var(--platform-accent-deep));
        color: #fff;
        border-color: transparent;
      }

      .dropzone {
        border: 2px dashed color-mix(in srgb, var(--platform-accent) 35%, #b8c7d9);
        border-radius: 24px;
        padding: 2.2rem 1.3rem;
        text-align: center;
        background:
          linear-gradient(180deg, rgba(248, 251, 255, 1), rgba(241, 245, 249, 0.92)),
          radial-gradient(circle at top right, var(--platform-wash), transparent 30%);
      }

      .dropzone.dragging {
        border-color: var(--platform-accent);
        background: color-mix(in srgb, var(--platform-wash) 72%, white);
      }

      .error {
        color: #b91c1c;
      }

      .progress {
        height: 9px;
        background: #e7e7e7;
        border-radius: 999px;
        overflow: hidden;
      }

      .bar {
        height: 100%;
        background: linear-gradient(90deg, var(--platform-accent), var(--platform-accent-deep));
        transition: width 0.2s;
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: 18px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(248, 251, 255, 0.86);
        color: #243b53;
        font-weight: 600;
      }

      .actions {
        display: flex;
        gap: 0.65rem;
        flex-wrap: wrap;
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .stat {
        padding: 1rem;
        border-radius: 20px;
        background: rgba(255,255,255,0.86);
        border: 1px solid rgba(15, 23, 42, 0.08);
      }

      .stat-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #829ab1;
      }

      .stat-value {
        margin-top: 0.35rem;
        font-size: 1.12rem;
        font-weight: 800;
        color: #102a43;
      }

      .feature-list {
        display: grid;
        gap: 0.85rem;
      }

      .feature-item {
        padding: 0.95rem 1rem;
        border-radius: 18px;
        background: rgba(255,255,255,0.86);
        border: 1px solid rgba(15, 23, 42, 0.08);
      }

      .feature-item strong {
        color: #102a43;
      }

      .feature-item span {
        display: block;
        margin-top: 0.35rem;
      }

      @media (max-width: 920px) {
        .hero,
        .stat-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  template: `
    <section class="container page-wrap">
      <div
        class="shell"
        [style.--platform-accent]="theme.accent"
        [style.--platform-accent-deep]="theme.accentDeep"
        [style.--platform-wash]="theme.wash"
      >
        <div class="hero">
          <div class="hero-card">
            <span class="eyebrow">{{ platformLabel }} Crop Page</span>
            <h1 class="section-title" style="font-size:2.45rem;line-height:1.05;margin-top:1rem;">{{ heroTitle }}</h1>
            <p class="section-subtitle" style="font-size:1.02rem;max-width:56ch;">{{ heroDescription }}</p>

            <div class="market-links" style="margin-top:1.1rem;">
              <a class="market-link" [class.active]="platform === 'meesho'" routerLink="/crop/meesho">Meesho</a>
              <a class="market-link" [class.active]="platform === 'flipkart'" routerLink="/crop/flipkart">Flipkart</a>
              <a class="market-link" [class.active]="platform === 'amazon'" routerLink="/crop/amazon">Amazon</a>
            </div>

            <div class="stat-grid" style="margin-top:1.2rem;">
              <div class="stat">
                <div class="stat-label">Route</div>
                <div class="stat-value">/crop/{{ platform }}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Default</div>
                <div class="stat-value">Label Only</div>
              </div>
              <div class="stat">
                <div class="stat-label">Optional</div>
                <div class="stat-value">Invoice Split</div>
              </div>
            </div>
          </div>

          <div class="tool-card">
            <div
              class="dropzone"
              [class.dragging]="isDragging"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              <div style="font-size:1rem;font-weight:800;color:#102a43;">{{ platformLabel }} upload</div>
              <p class="section-subtitle" style="margin-top:0.5rem;">{{ selectedFile?.name || uploadHint }}</p>
              <input style="margin-top:1rem;" type="file" accept="application/pdf" (change)="onFileInput($event)" />
            </div>

            <label class="toggle" style="margin-top:1rem;">
              <input type="checkbox" [(ngModel)]="keepInvoiceOnSeparatePage" />
              <span>Keep invoice on separate page</span>
            </label>

            <div *ngIf="errorMessage" class="error" style="margin-top:0.9rem;">{{ errorMessage }}</div>

            <div *ngIf="progress > 0" class="progress" style="margin-top:0.9rem;">
              <div class="bar" [style.width.%]="progress"></div>
            </div>

            <div class="actions" style="margin-top:1rem;">
              <button class="btn btn-primary" [disabled]="isProcessing" (click)="processFile()">
                {{ isProcessing ? 'Preparing...' : actionLabel }}
              </button>
              <button class="btn" [disabled]="!processedBlob" (click)="download()">Download PDF</button>
              <button class="btn" style="border-color:#fecaca;background:#fff1f2;" *ngIf="errorMessage" (click)="retry()">Retry</button>
            </div>
          </div>
        </div>

        <div class="tool-card">
          <h2 class="section-title" style="font-size:1.3rem;">Why separate pages help</h2>
          <div class="feature-list" style="margin-top:1rem;">
            <div class="feature-item">
              <strong>{{ platformLabel }}-specific copy and crop flow</strong>
              <span class="section-subtitle">Users reach the correct marketplace tool directly instead of switching tabs inside a generic page.</span>
            </div>
            <div class="feature-item">
              <strong>Cleaner future customization</strong>
              <span class="section-subtitle">Each route can get its own crop presets, help text, preview examples, and QA logic.</span>
            </div>
            <div class="feature-item">
              <strong>Closer to ecropper-style navigation</strong>
              <span class="section-subtitle">Marketplace-first entry points make the UI feel more intentional than the earlier simple card layout.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ToolPageComponent {
  platform: PlatformType = 'meesho';
  selectedFile: File | null = null;
  processedBlob: Blob | null = null;
  keepInvoiceOnSeparatePage = false;
  progress = 0;
  isProcessing = false;
  isDragging = false;
  errorMessage = '';

  constructor(
    private readonly pdfService: PdfService,
    private readonly route: ActivatedRoute
  ) {
    const routePlatform = this.route.snapshot.data['platform'] as PlatformType | undefined;
    if (routePlatform) {
      this.platform = routePlatform;
    }
  }

  get platformLabel(): string {
    return this.platform.charAt(0).toUpperCase() + this.platform.slice(1);
  }

  get theme(): { accent: string; accentDeep: string; wash: string } {
    switch (this.platform) {
      case 'flipkart':
        return { accent: '#f97316', accentDeep: '#c2410c', wash: 'rgba(249, 115, 22, 0.18)' };
      case 'amazon':
        return { accent: '#111827', accentDeep: '#f59e0b', wash: 'rgba(245, 158, 11, 0.18)' };
      default:
        return { accent: '#2563eb', accentDeep: '#1d4ed8', wash: 'rgba(37, 99, 235, 0.18)' };
    }
  }

  get heroTitle(): string {
    switch (this.platform) {
      case 'flipkart':
        return 'Prepare Flipkart shipping labels from a dedicated page.';
      case 'amazon':
        return 'Use an Amazon-specific route instead of a shared generic crop screen.';
      default:
        return 'Prepare Meesho shipping labels with invoice-aware crop control.';
    }
  }

  get heroDescription(): string {
    switch (this.platform) {
      case 'flipkart':
        return 'Upload Flipkart PDFs, keep invoice pages only when needed, and download a marketplace-focused processed file.';
      case 'amazon':
        return 'Amazon route keeps the UI focused and ready for Amazon-specific crop tuning as the tool grows.';
      default:
        return 'This page is tuned for Meesho label preparation, separate invoice handling, and closer comparison against your ecropper-style working output.';
    }
  }

  get uploadHint(): string {
    return `Drag & drop your ${this.platformLabel} PDF here or choose it manually.`;
  }

  get actionLabel(): string {
    return `Prepare ${this.platformLabel} Labels`;
  }

  setPlatform(platform: PlatformType): void {
    this.platform = platform;
  }

  onFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0] ?? null;
    this.selectFile(file);
  }

  processFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a PDF file first.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.processedBlob = null;
    this.progress = 0;

    this.pdfService.cropLabel(this.selectedFile, this.platform, this.keepInvoiceOnSeparatePage).subscribe({
      next: (event) => {
        this.progress = event.progress;
        if (event.blob) {
          this.processedBlob = event.blob;
        }
      },
      error: () => {
        this.errorMessage = 'Processing failed. Please try again.';
        this.isProcessing = false;
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  download(): void {
    if (!this.processedBlob) {
      return;
    }

    const blobUrl = URL.createObjectURL(this.processedBlob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `cropped-${this.platform}.pdf`;
    anchor.click();
    URL.revokeObjectURL(blobUrl);
  }

  retry(): void {
    this.errorMessage = '';
    this.processFile();
  }

  private selectFile(file: File | null): void {
    if (!file) {
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      this.errorMessage = 'Only PDF files are allowed.';
      this.selectedFile = null;
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;
  }
}
