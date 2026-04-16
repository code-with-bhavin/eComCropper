using EComCropper.Api.Models;
using EComCropper.Api.Services;
using iText.Kernel.Pdf;
using iText.Kernel.Utils;
using Microsoft.AspNetCore.Mvc;

namespace EComCropper.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PdfController : ControllerBase
{
    private static readonly HashSet<string> AllowedPlatforms = ["meesho", "flipkart", "amazon"];

    private readonly IPdfCropService _pdfCropService;

    public PdfController(IPdfCropService pdfCropService)
    {
        _pdfCropService = pdfCropService;
    }

    [HttpPost("crop")]
    [RequestFormLimits(MultipartBodyLengthLimit = 50 * 1024 * 1024)]
    [RequestSizeLimit(50 * 1024 * 1024)]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Crop([FromForm] CropRequest request, CancellationToken cancellationToken)
    {
        var files = request.Files.Count > 0
            ? request.Files
            : request.File is null
                ? []
                : [request.File];

        if (files.Count == 0 || files.All(file => file is null || file.Length == 0))
        {
            return BadRequest("At least one non-empty PDF file is required.");
        }

        foreach (var file in files)
        {
            if (file is null || file.Length == 0)
            {
                return BadRequest("All uploaded files must be non-empty PDFs.");
            }

            var isPdf =
                file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase) ||
                file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);

            if (!isPdf)
            {
                return BadRequest("Only PDF files are accepted.");
            }
        }

        if (!AllowedPlatforms.Contains(request.Platform.ToLowerInvariant()))
        {
            return BadRequest("Platform must be one of: meesho, flipkart, amazon.");
        }

        var shouldMergeManyToSinglePdf = files.Count > 1 || request.ReturnOriginalWithInvoice;

        if (!shouldMergeManyToSinglePdf)
        {
            await using var inputStream = files[0].OpenReadStream();
            var processedStream = await _pdfCropService.CropAsync(
                inputStream,
                request.Platform,
                request.KeepInvoiceOnSeparatePage,
                request.PickupSorting,
                request.SkuSorting,
                request.OrderNumberSorting,
                request.LabelText,
                cancellationToken);

            var singleName = request.Platform.Equals("meesho", StringComparison.OrdinalIgnoreCase)
                ? $"MeeshoCrop_{DateTime.Now:yyyy-MM-dd}.pdf"
                : $"cropped-{request.Platform}.pdf";

            return File(processedStream, "application/pdf", singleName);
        }

        // Merge many uploads into one output PDF (no ZIP).
        var mergedOutput = new MemoryStream();
        using (var writer = new PdfWriter(mergedOutput))
        using (var destinationDocument = new PdfDocument(writer))
        {
            // Keep the underlying MemoryStream open so we can rewind and return it.
            writer.SetCloseStream(false);
            var merger = new PdfMerger(destinationDocument);

            foreach (var file in files)
            {
                cancellationToken.ThrowIfCancellationRequested();

                await using var inputStream = file.OpenReadStream();
                var croppedStream = await _pdfCropService.CropAsync(
                    inputStream,
                    request.Platform,
                    request.KeepInvoiceOnSeparatePage,
                    request.PickupSorting,
                    request.SkuSorting,
                    request.OrderNumberSorting,
                    request.LabelText,
                    cancellationToken);

                croppedStream.Position = 0;
                using (var croppedReader = new PdfReader(croppedStream))
                using (var croppedDoc = new PdfDocument(croppedReader))
                {
                    merger.Merge(croppedDoc, 1, croppedDoc.GetNumberOfPages());
                }

                // If the user wants the original file (with invoice), append it into the same merged PDF.
                if (request.ReturnOriginalWithInvoice)
                {
                    await using var originalStream = file.OpenReadStream();
                    using (var originalReader = new PdfReader(originalStream))
                    using (var originalDoc = new PdfDocument(originalReader))
                    {
                        merger.Merge(originalDoc, 1, originalDoc.GetNumberOfPages());
                    }
                }
            }
        }

        mergedOutput.Position = 0;
        var mergedName = request.Platform.Equals("meesho", StringComparison.OrdinalIgnoreCase)
            ? $"MeeshoCrop_{DateTime.Now:yyyy-MM-dd}.pdf"
            : $"cropped-{request.Platform}.pdf";
        return File(mergedOutput, "application/pdf", mergedName);
    }

    [HttpPost("amazon/crop")]
    [RequestFormLimits(MultipartBodyLengthLimit = 50 * 1024 * 1024)]
    [RequestSizeLimit(50 * 1024 * 1024)]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CropAmazon([FromForm] AmazonCropRequest request, CancellationToken cancellationToken)
    {
        var files = request.Files.Count > 0
            ? request.Files
            : request.File is null
                ? []
                : [request.File];

        if (files.Count == 0 || files.All(file => file is null || file.Length == 0))
        {
            return BadRequest("At least one non-empty PDF file is required.");
        }

        foreach (var file in files)
        {
            if (file is null || file.Length == 0)
            {
                return BadRequest("All uploaded files must be non-empty PDFs.");
            }

            var isPdf =
                file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase) ||
                file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);

            if (!isPdf)
            {
                return BadRequest("Only PDF files are accepted.");
            }
        }

        if (files.Count == 1)
        {
            await using var inputStream = files[0].OpenReadStream();
            var processedStream = await _pdfCropService.CropAmazonAsync(inputStream, request.RemoveInvoiceWithExtraSpace, cancellationToken);
            return File(processedStream, "application/pdf", $"cropped-amazon.pdf");
        }

        var mergedOutput = new MemoryStream();
        using (var writer = new PdfWriter(mergedOutput))
        using (var destinationDocument = new PdfDocument(writer))
        {
            writer.SetCloseStream(false);
            var merger = new PdfMerger(destinationDocument);

            foreach (var file in files)
            {
                cancellationToken.ThrowIfCancellationRequested();

                await using var inputStream = file.OpenReadStream();
                var croppedStream = await _pdfCropService.CropAmazonAsync(inputStream, request.RemoveInvoiceWithExtraSpace, cancellationToken);

                croppedStream.Position = 0;
                using (var croppedReader = new PdfReader(croppedStream))
                using (var croppedDoc = new PdfDocument(croppedReader))
                {
                    merger.Merge(croppedDoc, 1, croppedDoc.GetNumberOfPages());
                }
            }
        }

        mergedOutput.Position = 0;
        return File(mergedOutput, "application/pdf", $"cropped-amazon.pdf");
    }

    [HttpPost("flipkart/crop")]
    [RequestFormLimits(MultipartBodyLengthLimit = 50 * 1024 * 1024)]
    [RequestSizeLimit(50 * 1024 * 1024)]
    [ProducesResponseType(typeof(FileResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CropFlipkart([FromForm] FlipkartCropRequest request, CancellationToken cancellationToken)
    {
        var files = request.Files.Count > 0
            ? request.Files
            : request.File is null
                ? []
                : [request.File];

        if (files.Count == 0 || files.All(file => file is null || file.Length == 0))
        {
            return BadRequest("At least one non-empty PDF file is required.");
        }

        foreach (var file in files)
        {
            if (file is null || file.Length == 0)
            {
                return BadRequest("All uploaded files must be non-empty PDFs.");
            }

            var isPdf =
                file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase) ||
                file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);

            if (!isPdf)
            {
                return BadRequest("Only PDF files are accepted.");
            }
        }

        if (files.Count == 1)
        {
            await using var inputStream = files[0].OpenReadStream();
            var processedStream = await _pdfCropService.CropFlipkartAsync(inputStream, request.RemoveInvoiceWithExtraSpace, cancellationToken);
            return File(processedStream, "application/pdf", $"cropped-flipkart.pdf");
        }

        var mergedOutput = new MemoryStream();
        using (var writer = new PdfWriter(mergedOutput))
        using (var destinationDocument = new PdfDocument(writer))
        {
            writer.SetCloseStream(false);
            var merger = new PdfMerger(destinationDocument);

            foreach (var file in files)
            {
                cancellationToken.ThrowIfCancellationRequested();

                await using var inputStream = file.OpenReadStream();
                var croppedStream = await _pdfCropService.CropFlipkartAsync(inputStream, request.RemoveInvoiceWithExtraSpace, cancellationToken);

                croppedStream.Position = 0;
                using (var croppedReader = new PdfReader(croppedStream))
                using (var croppedDoc = new PdfDocument(croppedReader))
                {
                    merger.Merge(croppedDoc, 1, croppedDoc.GetNumberOfPages());
                }
            }
        }

        mergedOutput.Position = 0;
        return File(mergedOutput, "application/pdf", $"cropped-flipkart.pdf");
    }
}
