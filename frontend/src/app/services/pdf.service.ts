import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type PlatformType = 'meesho' | 'flipkart' | 'amazon';

export interface UploadProgress {
  progress: number;
  blob?: Blob;
  fileName?: string;
  mimeType?: string;
}

export type CropLabelsOptions = {
  platform: PlatformType;
  keepInvoiceOnSeparatePage: boolean;
  pickupSorting?: boolean;
  skuSorting?: boolean;
  orderNumberSorting?: boolean;
  returnOriginalWithInvoice?: boolean;
  labelText?: string;
};

@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  cropLabels(files: File[], options: CropLabelsOptions): Observable<UploadProgress> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    // Backward-compatible for older server versions that only accept `file`.
    if (files.length === 1) {
      formData.append('file', files[0]);
    }

    formData.append('platform', options.platform);
    formData.append('keepInvoiceOnSeparatePage', String(options.keepInvoiceOnSeparatePage));
    formData.append('pickupSorting', String(Boolean(options.pickupSorting)));
    formData.append('skuSorting', String(Boolean(options.skuSorting)));
    formData.append('orderNumberSorting', String(Boolean(options.orderNumberSorting)));
    formData.append('returnOriginalWithInvoice', String(Boolean(options.returnOriginalWithInvoice)));
    formData.append('labelText', options.labelText ?? '');

    return this.http
      .post(`${this.baseUrl}/pdf/crop`, formData, {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true
      })
      .pipe(
        filter((event: HttpEvent<Blob>) => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
        map((event: HttpEvent<Blob>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
            return { progress };
          }

          const response = event as HttpResponse<Blob>;
          const contentDisposition = response.headers.get('content-disposition') ?? '';
          const fileName = parseContentDispositionFileName(contentDisposition) ?? undefined;
          const mimeType = response.headers.get('content-type') ?? response.body?.type ?? undefined;

          return {
            progress: 100,
            blob: response.body ?? undefined,
            fileName,
            mimeType
          };
        })
      );
  }

  cropLabel(file: File, platform: PlatformType, keepInvoiceOnSeparatePage: boolean): Observable<UploadProgress> {
    return this.cropLabels([file], { platform, keepInvoiceOnSeparatePage });
  }
}

function parseContentDispositionFileName(value: string): string | null {
  if (!value) {
    return null;
  }

  // RFC 5987: filename*=UTF-8''...
  const filenameStarMatch = /filename\*\s*=\s*([^;]+)/i.exec(value);
  if (filenameStarMatch?.[1]) {
    const raw = filenameStarMatch[1].trim();
    const parts = raw.split("''");
    if (parts.length === 2) {
      try {
        return decodeURIComponent(parts[1].replace(/^"|"$/g, ''));
      } catch {
        return parts[1].replace(/^"|"$/g, '');
      }
    }
  }

  const filenameMatch = /filename\s*=\s*([^;]+)/i.exec(value);
  if (filenameMatch?.[1]) {
    return filenameMatch[1].trim().replace(/^"|"$/g, '');
  }

  return null;
}
