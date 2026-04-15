import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type PlatformType = 'meesho' | 'flipkart' | 'amazon';

export interface UploadProgress {
  progress: number;
  blob?: Blob;
}

@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  cropLabel(file: File, platform: PlatformType, keepInvoiceOnSeparatePage: boolean): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', platform);
    formData.append('keepInvoiceOnSeparatePage', String(keepInvoiceOnSeparatePage));

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

          return {
            progress: 100,
            blob: response.body ?? undefined
          };
        })
      );
  }
}
