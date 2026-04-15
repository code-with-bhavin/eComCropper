import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfService, PlatformType } from '../../services/pdf.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      .tool-wrap {
        display: grid;
        gap: 0.9rem;
      }

      .tabs {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .tab {
        border: 1px solid #d0d0d0;
        background: #fff;
        padding: 0.5rem 0.9rem;
        border-radius: 7px;
        cursor: pointer;
      }

      .tab.active {
        background: #ecfdf5;
        border-color: #34d399;
        color: #065f46;
        font-weight: 600;
      }

      .dropzone {
        border: 1.5px dashed #bcbcbc;
        border-radius: 10px;
        padding: 1.4rem;
        text-align: center;
        background: #fafafa;
      }

      .dropzone.dragging {
        border-color: #10b981;
        background: #f0fdf4;
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
        background: #059669;
        transition: width 0.2s;
      }

      .actions {
        display: flex;
        gap: 0.65rem;
        flex-wrap: wrap;
      }
    `
  ],
  template: `
    <section class="container page-wrap">
      <div class="card tool-wrap">
        <h1 class="section-title">Label Crop Tool</h1>
        <p class="section-subtitle">Minimal UI: choose PDF + platform + process.</p>

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
          <p style="margin-top:0;">{{ selectedFile?.name || 'PDF ahi drop karo ke choose karo' }}</p>
          <input type="file" accept="application/pdf" (change)="onFileInput($event)" />
        </div>

        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

        <div *ngIf="progress > 0" class="progress">
          <div class="bar" [style.width.%]="progress"></div>
        </div>

        <div class="actions">
          <button class="btn btn-primary" [disabled]="isProcessing" (click)="processFile()">
            {{ isProcessing ? 'Processing...' : 'Upload & Process' }}
          </button>
          <button class="btn" [disabled]="!processedBlob" (click)="download()">Download PDF</button>
          <button class="btn" style="border-color:#fecaca;background:#fff1f2;" *ngIf="errorMessage" (click)="retry()">Retry</button>
        </div>
      </div>
    </section>
  `
})
export class ToolPageComponent {
  platform: PlatformType = 'meesho';
  selectedFile: File | null = null;
  processedBlob: Blob | null = null;
  progress = 0;
  isProcessing = false;
  isDragging = false;
  errorMessage = '';

  constructor(private readonly pdfService: PdfService) {}

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

    this.pdfService.cropLabel(this.selectedFile, this.platform).subscribe({
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

    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Only PDF files are allowed.';
      this.selectedFile = null;
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;
  }
}
