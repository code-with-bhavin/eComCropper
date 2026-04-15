using iText.Kernel.Geom;

namespace EComCropper.Api.Helpers;

public static class PdfCropHelper
{
    public static Rectangle GetCropRectangle(Rectangle pageSize, string platform)
    {
        var width = pageSize.GetWidth();
        var height = pageSize.GetHeight();

        return platform.ToLowerInvariant() switch
        {
            "meesho" => new Rectangle(width * 0.15f, height * 0.15f, width * 0.7f, height * 0.7f),
            "flipkart" => new Rectangle(width * 0.05f, height * 0.4f, width * 0.9f, height * 0.55f),
            "amazon" => new Rectangle(width * 0.03f, height * 0.03f, width * 0.94f, height * 0.94f),
            _ => throw new ArgumentException("Unsupported platform type.")
        };
    }

    public static Rectangle GetTarget4x6Page() => new Rectangle(288f, 432f);
}
