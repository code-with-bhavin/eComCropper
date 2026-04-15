using EComCropper.Api.Models;
using EComCropper.Api.Services;
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
        if (request.File is null || request.File.Length == 0)
        {
            return BadRequest("A non-empty PDF file is required.");
        }

        if (!request.File.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only PDF files are accepted.");
        }

        if (!AllowedPlatforms.Contains(request.Platform.ToLowerInvariant()))
        {
            return BadRequest("Platform must be one of: meesho, flipkart, amazon.");
        }

        await using var inputStream = request.File.OpenReadStream();
        var processedStream = await _pdfCropService.CropAsync(inputStream, request.Platform, cancellationToken);

        return File(processedStream, "application/pdf", $"cropped-{request.Platform}.pdf");
    }
}
