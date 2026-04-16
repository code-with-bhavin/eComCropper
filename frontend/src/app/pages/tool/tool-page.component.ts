import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfService, PlatformType } from '../../services/pdf.service';

type ProcessingHistoryItem = {
  id: string;
  platform: PlatformType;
  createdAt: Date;
  sourceFileName: string;
  outputBlob: Blob;
  outputUrl: string;
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="container page-wrap">
      <div class="grid gap-5">
        <div class="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
            <span class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-700">
              {{ platformLabel }} label crop
            </span>
            <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{{ platformLabel }} shipping label crop</h1>
            <p class="mt-3 max-w-[64ch] text-sm leading-7 text-slate-600">
              Simply choose your {{ platformLabel }} label PDF, hit “Prepare Shipping Labels”, and download a freshly cropped output in moments.
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <a
                class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                [class.bg-gradient-to-br]="platform === 'meesho'"
                [class.from-blue-600]="platform === 'meesho'"
                [class.to-blue-700]="platform === 'meesho'"
                [class.text-white]="platform === 'meesho'"
                [class.shadow-md]="platform === 'meesho'"
                routerLink="/crop/meesho"
                >Meesho</a
              >
              <a
                class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                [class.bg-gradient-to-br]="platform === 'flipkart'"
                [class.from-blue-600]="platform === 'flipkart'"
                [class.to-blue-700]="platform === 'flipkart'"
                [class.text-white]="platform === 'flipkart'"
                [class.shadow-md]="platform === 'flipkart'"
                routerLink="/crop/flipkart"
                >Flipkart</a
              >
              <a
                class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                [class.bg-gradient-to-br]="platform === 'amazon'"
                [class.from-blue-600]="platform === 'amazon'"
                [class.to-blue-700]="platform === 'amazon'"
                [class.text-white]="platform === 'amazon'"
                [class.shadow-md]="platform === 'amazon'"
                routerLink="/crop/amazon"
                >Amazon</a
              >
            </div>

            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
                <div class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Flow</div>
                <div class="mt-1 text-sm font-extrabold text-slate-900">Upload → Prepare → Download</div>
              </div>
              <div class="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
                <div class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Output</div>
                <div class="mt-1 text-sm font-extrabold text-slate-900">Print-ready PDF</div>
              </div>
              <div class="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
                <div class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Optional</div>
                <div class="mt-1 text-sm font-extrabold text-slate-900">Invoice Split</div>
              </div>
            </div>
          </div>

          <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
            <div
              class="rounded-3xl border-2 border-dashed border-blue-600/30 bg-gradient-to-b from-blue-50 to-slate-50 px-6 py-8 text-center transition"
              [class.border-blue-600]="isDragging"
              [class.bg-blue-50]="isDragging"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              <div class="text-sm font-extrabold text-slate-900">{{ platformLabel }} upload</div>
              <p class="mt-2 text-sm leading-7 text-slate-600">{{ selectedFile?.name || uploadHint }}</p>
              <input class="mt-4 w-full text-sm" type="file" accept="application/pdf" (change)="onFileInput($event)" />
            </div>

            <label class="mt-4 flex items-center gap-3 rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" class="size-4 accent-blue-600" [(ngModel)]="keepInvoiceOnSeparatePage" />
              <span>Keep invoice on separate page</span>
            </label>

            <div *ngIf="errorMessage" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {{ errorMessage }}
            </div>

            <div *ngIf="progress > 0" class="mt-4">
              <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div class="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700" [style.width.%]="progress"></div>
              </div>
              <div class="mt-2 text-xs font-semibold text-slate-500">{{ progress }}%</div>
            </div>

            <div class="mt-4 flex flex-wrap gap-3">
              <button class="btn btn-primary" [disabled]="isProcessing" (click)="processFile()">
                {{ isProcessing ? 'Preparing...' : actionLabel }}
              </button>
              <button
                class="btn border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
                *ngIf="errorMessage"
                (click)="retry()"
              >
                Retry
              </button>
            </div>
          </div>
        </div>

        <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
          <h2 class="text-lg font-extrabold tracking-tight text-slate-900">Label Processing History</h2>
          <p class="mt-2 max-w-[72ch] text-sm leading-7 text-slate-600">
            Your processed labels appear here in this browser session after successful cropping. Nothing is saved to an account.
          </p>

          <div class="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div class="overflow-hidden rounded-2xl border border-slate-900/10 bg-white">
              <div *ngIf="!previewUrl" class="p-5 text-slate-600">
                <div class="inline-flex rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-700">
                  PREVIEW
                </div>
                <div class="mt-3 text-sm font-semibold">No processing history available.</div>
                <div class="mt-1 text-sm leading-7 text-slate-500">
                  Upload a PDF and click “Prepare Shipping Labels” to see a preview here.
                </div>
              </div>
              <iframe *ngIf="previewUrl" class="block h-[380px] w-full bg-white" [src]="previewUrl" title="Processed PDF preview"></iframe>
            </div>

            <div class="grid gap-3">
              <div *ngIf="history.length === 0" class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
                <div class="inline-flex rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-700">
                  HISTORY
                </div>
                <div class="mt-2 text-sm text-slate-600">No items yet.</div>
              </div>

              <div *ngFor="let item of history" class="rounded-2xl border border-slate-900/10 bg-white px-5 py-4 shadow-sm">
                <div class="grid gap-1">
                  <div class="text-sm font-extrabold text-slate-900">{{ item.sourceFileName }}</div>
                  <div class="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    <span class="inline-flex rounded-full border border-slate-900/10 bg-slate-50 px-2.5 py-1 text-slate-700">
                      {{ item.platform }}
                    </span>
                    <span class="self-center">{{ item.createdAt | date: 'medium' }}</span>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-3">
                  <button class="btn" (click)="setPreview(item)">Preview</button>
                  <button class="btn" (click)="downloadHistory(item)">Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card rounded-[28px] border-slate-900/10 bg-white/90 p-6 shadow-soft">
          <h2 class="text-lg font-extrabold tracking-tight text-slate-900">Raise Request for other ecommerce platform support</h2>
          <p class="mt-2 max-w-[86ch] text-sm leading-7 text-slate-600">
            Want support for another platform or a custom label format? Share a sample label and your requirement. We’ll use it to improve the crop
            rules.
          </p>

          <div class="mt-4 flex flex-wrap gap-3">
            <a class="btn btn-primary" [routerLink]="['/contact']" [queryParams]="{ platform: platform }">Raise Request</a>
            <a class="btn" routerLink="/privacy">Privacy</a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ToolPageComponent implements OnDestroy {
  platform: PlatformType = 'meesho';
  selectedFile: File | null = null;
  processedBlob: Blob | null = null;
  private processedBlobUrl: string | null = null;
  keepInvoiceOnSeparatePage = false;
  progress = 0;
  isProcessing = false;
  isDragging = false;
  errorMessage = '';

  constructor(
    private readonly pdfService: PdfService,
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer
  ) {
    const routePlatform = this.route.snapshot.data['platform'] as PlatformType | undefined;
    if (routePlatform) {
      this.platform = routePlatform;
    }
  }

  history: ProcessingHistoryItem[] = [];
  previewUrl: SafeResourceUrl | null = null;

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
    return 'Prepare Shipping Labels';
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
    this.releaseProcessedBlobUrl();
    this.progress = 0;

    this.pdfService.cropLabel(this.selectedFile, this.platform, this.keepInvoiceOnSeparatePage).subscribe({
      next: (event) => {
        this.progress = event.progress;
        if (event.blob) {
          this.processedBlob = event.blob;
          this.processedBlobUrl = URL.createObjectURL(event.blob);
          const historyItem: ProcessingHistoryItem = {
            id: this.createId(),
            platform: this.platform,
            createdAt: new Date(),
            sourceFileName: this.selectedFile?.name ?? `label-${this.platform}.pdf`,
            outputBlob: event.blob,
            outputUrl: this.processedBlobUrl
          };

          this.history = [historyItem, ...this.history].slice(0, 8);
          this.setPreview(historyItem);

          // Auto-download immediately when processing completes.
          this.downloadBlob(event.blob, `cropped-${this.platform}.pdf`);
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

    this.downloadBlob(this.processedBlob, `cropped-${this.platform}.pdf`);
  }

  retry(): void {
    this.errorMessage = '';
    this.processFile();
  }

  setPreview(item: ProcessingHistoryItem): void {
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.outputUrl);
  }

  downloadHistory(item: ProcessingHistoryItem): void {
    this.downloadBlob(item.outputBlob, `cropped-${item.platform}.pdf`);
  }

  ngOnDestroy(): void {
    this.releaseProcessedBlobUrl();
    for (const item of this.history) {
      URL.revokeObjectURL(item.outputUrl);
    }
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

  private releaseProcessedBlobUrl(): void {
    if (!this.processedBlobUrl) {
      return;
    }
    URL.revokeObjectURL(this.processedBlobUrl);
    this.processedBlobUrl = null;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(blobUrl);
  }

  private createId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}
