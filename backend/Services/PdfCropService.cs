using EComCropper.Api.Helpers;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;

namespace EComCropper.Api.Services;

public class PdfCropService : IPdfCropService
{
    public async Task<MemoryStream> CropAsync(Stream inputPdfStream, string platform, CancellationToken cancellationToken = default)
    {
        var outputStream = new MemoryStream();

        await Task.Run(() =>
        {
            using var reader = new PdfReader(inputPdfStream);
            using var writer = new PdfWriter(outputStream, new WriterProperties().SetFullCompressionMode(true));
            using var sourceDocument = new PdfDocument(reader);
            using var destinationDocument = new PdfDocument(writer);

            var pageCount = sourceDocument.GetNumberOfPages();
            var targetPageSize = PdfCropHelper.GetTarget4x6Page();

            for (var pageNumber = 1; pageNumber <= pageCount; pageNumber++)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var sourcePage = sourceDocument.GetPage(pageNumber);
                var sourcePageSize = sourcePage.GetPageSize();
                var cropArea = PdfCropHelper.GetCropRectangle(sourcePageSize, platform);

                sourcePage.SetCropBox(cropArea);
                sourcePage.SetMediaBox(cropArea);

                var destinationPage = destinationDocument.AddNewPage(new PageSize(targetPageSize));
                var pageCanvas = new PdfCanvas(destinationPage);
                var croppedXObject = sourcePage.CopyAsFormXObject(destinationDocument);

                pageCanvas.AddXObjectFittedIntoRectangle(
                    croppedXObject,
                    new Rectangle(0, 0, targetPageSize.GetWidth(), targetPageSize.GetHeight())
                );
            }
        }, cancellationToken);

        outputStream.Position = 0;
        return outputStream;
    }
}
