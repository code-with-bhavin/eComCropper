using iText.Kernel.Geom;

namespace EComCropper.Api.Helpers;

public static class PdfCropHelper
{
    private static readonly Rectangle A4PageSize = new(0, 0, 595, 842);
    private static readonly Rectangle HalfPageSize = new(0, 0, 595, 421);

    // Extracted from the provided ecropper Meesho PDF.
    private static readonly Rectangle MeeshoLabelCropBox = new(0, 471.92f, 800, 1000);

    public static IReadOnlyList<CropRegion> GetCropRegions(string platform, bool keepInvoiceOnSeparatePage) =>
        platform.ToLowerInvariant() switch
        {
            "meesho" => BuildMeeshoRegions(keepInvoiceOnSeparatePage),
            "flipkart" or "amazon" => BuildDefaultHalfPageRegions(keepInvoiceOnSeparatePage),
            _ => throw new ArgumentException("Unsupported platform type.")
        };

    private static IReadOnlyList<CropRegion> BuildMeeshoRegions(bool keepInvoiceOnSeparatePage)
    {
        var regions = new List<CropRegion>
        {
            new()
            {
                SourceBounds = A4PageSize,
                OutputPageSize = A4PageSize,
                OutputCropBox = MeeshoLabelCropBox,
                RenderMode = CropRenderMode.OriginalPageWithCropBox
            }
        };

        if (keepInvoiceOnSeparatePage)
        {
            regions.Add(new CropRegion
            {
                SourceBounds = new Rectangle(0, 0, 595, 421),
                OutputPageSize = HalfPageSize,
                RenderMode = CropRenderMode.TranslatedCrop
            });
        }

        return regions;
    }

    private static IReadOnlyList<CropRegion> BuildDefaultHalfPageRegions(bool keepInvoiceOnSeparatePage)
    {
        var regions = new List<CropRegion>
        {
            new()
            {
                SourceBounds = new Rectangle(0, 421, 595, 421),
                OutputPageSize = HalfPageSize,
                RenderMode = CropRenderMode.TranslatedCrop
            }
        };

        if (keepInvoiceOnSeparatePage)
        {
            regions.Add(new CropRegion
            {
                SourceBounds = new Rectangle(0, 0, 595, 421),
                OutputPageSize = HalfPageSize,
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
