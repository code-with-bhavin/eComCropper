using EComCropper.Api.Helpers;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;

namespace EComCropper.Api.Services;

public class PdfCropService : IPdfCropService
{
    public async Task<MemoryStream> CropAsync(
        Stream inputPdfStream,
        string platform,
        bool keepInvoiceOnSeparatePage,
        CancellationToken cancellationToken = default)
    {
        var outputStream = new MemoryStream();

        await Task.Run(() =>
        {
            using var reader = new PdfReader(inputPdfStream);
            using var writer = new PdfWriter(outputStream);
            writer.SetCloseStream(false);
            using var sourceDocument = new PdfDocument(reader);
            using var destinationDocument = new PdfDocument(writer);

            var pageCount = sourceDocument.GetNumberOfPages();
            var cropRegions = PdfCropHelper.GetCropRegions(platform, keepInvoiceOnSeparatePage);

            for (var pageNumber = 1; pageNumber <= pageCount; pageNumber++)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var sourcePage = sourceDocument.GetPage(pageNumber);
                var sourcePageXObject = sourcePage.CopyAsFormXObject(destinationDocument);

                foreach (var cropRegion in cropRegions)
                {
                    var sourceBounds = cropRegion.SourceBounds;
                    var targetPageSize = cropRegion.OutputPageSize;
                    var destinationPage = destinationDocument.AddNewPage(new PageSize(targetPageSize));
                    var pageCanvas = new PdfCanvas(destinationPage);

                    pageCanvas.SaveState();
                    
                    if (cropRegion.RenderMode == CropRenderMode.OriginalPageWithCropBox)
                    {
                        if (cropRegion.OutputCropBox is not null)
                        {
                            destinationPage.SetCropBox(cropRegion.OutputCropBox);
                        }

                        pageCanvas.AddXObjectAt(sourcePageXObject, 0, 0);
                    }
                    else
                    {
                        pageCanvas.Rectangle(0, 0, targetPageSize.GetWidth(), targetPageSize.GetHeight());
                        pageCanvas.Clip();
                        pageCanvas.EndPath();
                        pageCanvas.ConcatMatrix(
                            1,
                            0,
                            0,
                            1,
                            -sourceBounds.GetX(),
                            -sourceBounds.GetY());
                        pageCanvas.AddXObjectAt(sourcePageXObject, 0, 0);
                    }

                    pageCanvas.RestoreState();
                }
            }
        }, cancellationToken);

        outputStream.Position = 0;
        return outputStream;
    }
}
