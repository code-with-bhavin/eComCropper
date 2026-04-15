import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfService, PlatformType } from '../../services/pdf.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      .tabs { display: flex; gap: 0.5rem; }
      .tab { border: 1px solid #bcccdc; background: #fff; padding: 0.5rem 1rem; border-radius: 9px; cursor: pointer; }
      .tab.active { background: #ebf2ff; border-color: #2962ff; color: #1f4fd4; }
      .dropzone {
        border: 2px dashed #9fb3c8;
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        background: #f8fbff;
      }
      .dropzone.dragging { border-color: #2962ff; background: #ebf2ff; }
      .error { color: #d64545; margin-top: 0.75rem; }
      .progress { height: 10px; background: #d9e2ec; border-radius: 10px; overflow: hidden; margin-top: 0.75rem; }
      .bar { height: 100%; background: #2962ff; transition: width 0.2s; }
      .toggle {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid #d9e2ec;
        border-radius: 12px;
        background: #f8fbff;
        font-weight: 600;
        color: #243b53;
      }
      .toggle input {
        width: 1.1rem;
        height: 1.1rem;
      }
    `
  ],
  template: `
    <section class="container" style="padding-top:2rem;">
      <div class="card" style="padding:1.5rem;display:grid;gap:1rem;">
        <h1 class="section-title">{{ platformLabel }} shipping label crop</h1>
        <p class="section-subtitle">
          Upload an A4 marketplace PDF. By default we keep only the top-half shipping label from each page.
        </p>

        <div class="tabs">
          <button class="tab" [class.active]="platform === 'meesho'" (click)="setPlatform('meesho')">Meesho</button>
          <button class="tab" [class.active]="platform === 'flipkart'" (click)="setPlatform('flipkart')">Flipkart</button>
          <button class="tab" [class.active]="platform === 'amazon'" (click)="setPlatform('amazon')">Amazon</button>
        </div>

        <div
          class="dropzone"
          [class.dragging]="isDragging"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <p>{{ selectedFile?.name || 'Drag & drop PDF file here or choose manually.' }}</p>
          <input type="file" accept="application/pdf" (change)="onFileInput($event)" />
        </div>

        <label class="toggle">
          <input type="checkbox" [(ngModel)]="keepInvoiceOnSeparatePage" />
          <span>Keep invoice on separate page</span>
        </label>

        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

        <div *ngIf="progress > 0" class="progress">
          <div class="bar" [style.width.%]="progress"></div>
        </div>

        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <button class="btn btn-primary" [disabled]="isProcessing" (click)="processFile()">
            {{ isProcessing ? 'Preparing...' : 'Prepare Shipping Labels' }}
          </button>
          <button class="btn" style="background:#fff;border:1px solid #bcccdc;" [disabled]="!processedBlob" (click)="download()">
            Download Processed PDF
          </button>
          <button class="btn" style="background:#fff0f0;border:1px solid #fcc;" *ngIf="errorMessage" (click)="retry()">
            Retry
          </button>
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

  constructor(private readonly pdfService: PdfService) {}

  get platformLabel(): string {
    return this.platform.charAt(0).toUpperCase() + this.platform.slice(1);
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
