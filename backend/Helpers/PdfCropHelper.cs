using iText.Kernel.Geom;

namespace EComCropper.Api.Helpers;

public static class PdfCropHelper
{
    // Tuned to match the user's "perfect" Meesho output PDF.
    // Reference crop box: [0, 471.31, 595, 370.69] on A4 [0,0,595,842]
    private const float MeeshoLabelCropY = 471.31f;
    private const float MeeshoLabelHeight = 370.69f;
    private const float MeeshoInvoiceY = 200.22f;
    private const float MeeshoInvoiceHeight = 291.7f;

    public static IReadOnlyList<CropRegion> GetCropRegions(string platform, bool keepInvoiceOnSeparatePage, Rectangle sourcePageSize) =>
        platform.ToLowerInvariant() switch
        {
            "meesho" => BuildMeeshoRegions(keepInvoiceOnSeparatePage, sourcePageSize),
            "flipkart" or "amazon" => BuildDefaultHalfPageRegions(keepInvoiceOnSeparatePage, sourcePageSize),
            _ => throw new ArgumentException("Unsupported platform type.")
        };

    private static IReadOnlyList<CropRegion> BuildMeeshoRegions(bool keepInvoiceOnSeparatePage, Rectangle pageSize)
    {
        var normalizedPage = new Rectangle(0, 0, pageSize.GetWidth(), pageSize.GetHeight());
        var pageWidth = normalizedPage.GetWidth();
        var labelY = Math.Max(0, Math.Min(normalizedPage.GetHeight(), MeeshoLabelCropY));
        var labelHeight = Math.Max(0, Math.Min(normalizedPage.GetHeight() - labelY, MeeshoLabelHeight));

        var regions = new List<CropRegion>
        {
            new()
            {
                SourceBounds = normalizedPage,
                OutputPageSize = normalizedPage,
                OutputCropBox = new Rectangle(0, labelY, pageWidth, labelHeight),
                RenderMode = CropRenderMode.OriginalPageWithCropBox
            }
        };

        if (keepInvoiceOnSeparatePage)
        {
            regions.Add(new CropRegion
            {
                SourceBounds = normalizedPage,
                OutputPageSize = normalizedPage,
                OutputCropBox = new Rectangle(0, MeeshoInvoiceY, pageWidth, MeeshoInvoiceHeight),
                RenderMode = CropRenderMode.OriginalPageWithCropBox
            });
        }

        return regions;
    }

    private static IReadOnlyList<CropRegion> BuildDefaultHalfPageRegions(bool keepInvoiceOnSeparatePage, Rectangle pageSize)
    {
        var normalizedPage = new Rectangle(0, 0, pageSize.GetWidth(), pageSize.GetHeight());
        var halfHeight = normalizedPage.GetHeight() / 2f;
        var halfPageSize = new Rectangle(0, 0, normalizedPage.GetWidth(), halfHeight);

        var regions = new List<CropRegion>
        {
            new()
            {
                SourceBounds = new Rectangle(0, halfHeight, normalizedPage.GetWidth(), halfHeight),
                OutputPageSize = halfPageSize,
                RenderMode = CropRenderMode.TranslatedCrop
            }
        };

        if (keepInvoiceOnSeparatePage)
        {
            regions.Add(new CropRegion
            {
                SourceBounds = new Rectangle(0, 0, normalizedPage.GetWidth(), halfHeight),
                OutputPageSize = halfPageSize,
                RenderMode = CropRenderMode.TranslatedCrop
            });
        }

        return regions;
    }
}

public sealed class CropRegion
{
    public Rectangle SourceBounds { get; init; } = default!;
    public Rectangle OutputPageSize { get; init; } = default!;
    public Rectangle? OutputCropBox { get; init; }
    public CropRenderMode RenderMode { get; init; } = CropRenderMode.TranslatedCrop;
}

public enum CropRenderMode
{
    TranslatedCrop,
    OriginalPageWithCropBox
}
