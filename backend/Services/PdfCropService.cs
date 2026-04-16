using EComCropper.Api.Helpers;
using iText.IO.Font.Constants;
using iText.Kernel.Colors;
using iText.Kernel.Geom;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Data;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Font;
using System.Text.RegularExpressions;

namespace EComCropper.Api.Services;

public class PdfCropService : IPdfCropService
{
    public async Task<MemoryStream> CropAsync(
        Stream inputPdfStream,
        string platform,
        bool keepInvoiceOnSeparatePage,
        bool pickupSorting,
        bool skuSorting,
        bool orderNumberSorting,
        string? labelText,
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
            var sourcePageSize = sourceDocument.GetPage(1).GetPageSize();
            var cropRegions = PdfCropHelper.GetCropRegions(platform, keepInvoiceOnSeparatePage, sourcePageSize);

            var sortMode = GetSortMode(pickupSorting, skuSorting, orderNumberSorting);
            var pageOrder = BuildPageOrder(sourceDocument, pageCount, sortMode);

            var shouldPrintLabelText =
                platform.Equals("meesho", StringComparison.OrdinalIgnoreCase) &&
                !string.IsNullOrWhiteSpace(labelText);

            PdfFont? labelFont = null;
            if (shouldPrintLabelText)
            {
                labelFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
            }

            foreach (var pageNumber in pageOrder)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var sourcePage = sourceDocument.GetPage(pageNumber);
                var sourcePageXObject = sourcePage.CopyAsFormXObject(destinationDocument);
                var shouldRedactFooterText = platform.Equals("meesho", StringComparison.OrdinalIgnoreCase);
                var footerRedactionRects = shouldRedactFooterText
                    ? FindTextRectangles(
                        sourcePage,
                        ["TAX INVOICE", "Original For Recipient"])
                    : Array.Empty<Rectangle>();

                for (var cropRegionIndex = 0; cropRegionIndex < cropRegions.Count; cropRegionIndex++)
                {
                    var cropRegion = cropRegions[cropRegionIndex];
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

                        // Remove footer labels from Meesho output without changing crop/blank space.
                        if (shouldRedactFooterText && cropRegionIndex == 0 && footerRedactionRects.Count > 0)
                        {
                            pageCanvas.SaveState();
                            pageCanvas.SetFillColor(ColorConstants.WHITE);

                            var crop = destinationPage.GetCropBox() ?? destinationPage.GetPageSize();

                            foreach (var rect in footerRedactionRects)
                            {
                                // Only redact if the text is inside the visible crop area.
                                if (!Intersects(crop, rect))
                                {
                                    continue;
                                }

                                // Slightly expand to fully cover antialiasing.
                                const float pad = 2f;
                                pageCanvas.Rectangle(
                                    rect.GetX() - pad,
                                    rect.GetY() - pad,
                                    rect.GetWidth() + (pad * 2),
                                    rect.GetHeight() + (pad * 2));
                                pageCanvas.Fill();
                            }

                            pageCanvas.RestoreState();
                        }
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

                    if (shouldPrintLabelText && cropRegionIndex == 0 && labelFont is not null)
                    {
                        var cropBox = destinationPage.GetCropBox();
                        var x = (cropBox?.GetX() ?? 0) + 18;
                        var y = (cropBox?.GetY() ?? 0) + 5;

                        pageCanvas.BeginText();
                        pageCanvas.SetFontAndSize(labelFont, 9);
                        pageCanvas.MoveText(x, y);
                        pageCanvas.ShowText(labelText!.Trim());
                        pageCanvas.EndText();
                    }

                    pageCanvas.RestoreState();
                }
            }
        }, cancellationToken);

        outputStream.Position = 0;
        return outputStream;
    }

    public async Task<MemoryStream> CropAmazonAsync(
        Stream inputPdfStream,
        bool removeInvoiceWithExtraSpace,
        CancellationToken cancellationToken = default)
    {
        var outputStream = new MemoryStream();

        await CropIntoStreamAsync(
            outputStream,
            inputPdfStream,
            cropRegionsSelector: sourcePageSize => PdfCropHelper.GetAmazonCropRegions(removeInvoiceWithExtraSpace, sourcePageSize),
            sortMode: SortMode.None,
            shouldRedactFooterText: false,
            labelText: null,
            cancellationToken);

        outputStream.Position = 0;
        return outputStream;
    }

    public async Task<MemoryStream> CropFlipkartAsync(
        Stream inputPdfStream,
        bool removeInvoiceWithExtraSpace,
        CancellationToken cancellationToken = default)
    {
        var outputStream = new MemoryStream();

        await CropIntoStreamAsync(
            outputStream,
            inputPdfStream,
            cropRegionsSelector: sourcePageSize => PdfCropHelper.GetFlipkartCropRegions(removeInvoiceWithExtraSpace, sourcePageSize),
            sortMode: SortMode.None,
            shouldRedactFooterText: false,
            labelText: null,
            cancellationToken);

        outputStream.Position = 0;
        return outputStream;
    }

    private static async Task CropIntoStreamAsync(
        MemoryStream outputStream,
        Stream inputPdfStream,
        Func<Rectangle, IReadOnlyList<CropRegion>> cropRegionsSelector,
        SortMode sortMode,
        bool shouldRedactFooterText,
        string? labelText,
        CancellationToken cancellationToken)
    {
        await Task.Run(() =>
        {
            using var reader = new PdfReader(inputPdfStream);
            using var writer = new PdfWriter(outputStream);
            writer.SetCloseStream(false);
            using var sourceDocument = new PdfDocument(reader);
            using var destinationDocument = new PdfDocument(writer);

            var pageCount = sourceDocument.GetNumberOfPages();
            var sourcePageSize = sourceDocument.GetPage(1).GetPageSize();
            var cropRegions = cropRegionsSelector(sourcePageSize);

            var pageOrder = BuildPageOrder(sourceDocument, pageCount, sortMode);

            var shouldPrintLabelText = !string.IsNullOrWhiteSpace(labelText);
            PdfFont? labelFont = null;
            if (shouldPrintLabelText)
            {
                labelFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
            }

            foreach (var pageNumber in pageOrder)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var sourcePage = sourceDocument.GetPage(pageNumber);
                var sourcePageXObject = sourcePage.CopyAsFormXObject(destinationDocument);
                var footerRedactionRects = shouldRedactFooterText
                    ? FindTextRectangles(sourcePage, ["TAX INVOICE", "Original For Recipient"])
                    : Array.Empty<Rectangle>();

                for (var cropRegionIndex = 0; cropRegionIndex < cropRegions.Count; cropRegionIndex++)
                {
                    var cropRegion = cropRegions[cropRegionIndex];
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

                        if (shouldRedactFooterText && cropRegionIndex == 0 && footerRedactionRects.Count > 0)
                        {
                            pageCanvas.SaveState();
                            pageCanvas.SetFillColor(ColorConstants.WHITE);

                            var crop = destinationPage.GetCropBox() ?? destinationPage.GetPageSize();

                            foreach (var rect in footerRedactionRects)
                            {
                                if (!Intersects(crop, rect))
                                {
                                    continue;
                                }

                                const float pad = 2f;
                                pageCanvas.Rectangle(
                                    rect.GetX() - pad,
                                    rect.GetY() - pad,
                                    rect.GetWidth() + (pad * 2),
                                    rect.GetHeight() + (pad * 2));
                                pageCanvas.Fill();
                            }

                            pageCanvas.RestoreState();
                        }
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

                    if (shouldPrintLabelText && cropRegionIndex == 0 && labelFont is not null)
                    {
                        var cropBox = destinationPage.GetCropBox();
                        var x = (cropBox?.GetX() ?? 0) + 18;
                        var y = (cropBox?.GetY() ?? 0) + 5;

                        pageCanvas.BeginText();
                        pageCanvas.SetFontAndSize(labelFont, 9);
                        pageCanvas.MoveText(x, y);
                        pageCanvas.ShowText(labelText!.Trim());
                        pageCanvas.EndText();
                    }

                    pageCanvas.RestoreState();
                }
            }
        }, cancellationToken);
    }

    private static IReadOnlyList<Rectangle> FindTextRectangles(PdfPage page, IReadOnlyList<string> markers)
    {
        var listener = new MarkerRectListener(markers);
        var processor = new PdfCanvasProcessor(listener);
        processor.ProcessPageContent(page);
        return listener.Rectangles;
    }

    private sealed class MarkerRectListener(IReadOnlyList<string> markers) : IEventListener
    {
        public List<Rectangle> Rectangles { get; } = [];

        public void EventOccurred(IEventData data, EventType type)
        {
            if (type != EventType.RENDER_TEXT)
            {
                return;
            }

            var textInfo = (TextRenderInfo)data;
            var text = textInfo.GetText();
            if (string.IsNullOrWhiteSpace(text))
            {
                return;
            }

            for (var i = 0; i < markers.Count; i++)
            {
                if (!text.Contains(markers[i], StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                // Build a rectangle from ascent/descent lines.
                var ascent = textInfo.GetAscentLine().GetBoundingRectangle();
                var descent = textInfo.GetDescentLine().GetBoundingRectangle();

                var x = Math.Min(ascent.GetX(), descent.GetX());
                var y = Math.Min(ascent.GetY(), descent.GetY());
                var right = Math.Max(ascent.GetX() + ascent.GetWidth(), descent.GetX() + descent.GetWidth());
                var top = Math.Max(ascent.GetY() + ascent.GetHeight(), descent.GetY() + descent.GetHeight());

                Rectangles.Add(new Rectangle(x, y, right - x, top - y));
                break;
            }
        }

        public ICollection<EventType> GetSupportedEvents() =>
            [EventType.RENDER_TEXT];
    }

    private static bool Intersects(Rectangle a, Rectangle b)
    {
        var aLeft = a.GetX();
        var aBottom = a.GetY();
        var aRight = a.GetX() + a.GetWidth();
        var aTop = a.GetY() + a.GetHeight();

        var bLeft = b.GetX();
        var bBottom = b.GetY();
        var bRight = b.GetX() + b.GetWidth();
        var bTop = b.GetY() + b.GetHeight();

        return aLeft < bRight && aRight > bLeft && aBottom < bTop && aTop > bBottom;
    }

    private enum SortMode
    {
        None,
        Pickup,
        Sku,
        OrderNumber
    }

    private static SortMode GetSortMode(bool pickupSorting, bool skuSorting, bool orderNumberSorting)
    {
        if (pickupSorting)
        {
            return SortMode.Pickup;
        }

        if (skuSorting)
        {
            return SortMode.Sku;
        }

        if (orderNumberSorting)
        {
            return SortMode.OrderNumber;
        }

        return SortMode.None;
    }

    private static IReadOnlyList<int> BuildPageOrder(PdfDocument sourceDocument, int pageCount, SortMode sortMode)
    {
        if (sortMode == SortMode.None)
        {
            return Enumerable.Range(1, pageCount).ToArray();
        }

        var keys = new List<(int PageNumber, string Key)>(capacity: pageCount);

        for (var pageNumber = 1; pageNumber <= pageCount; pageNumber++)
        {
            var text = PdfTextExtractor.GetTextFromPage(sourceDocument.GetPage(pageNumber)) ?? string.Empty;
            var key = ExtractSortKey(text, sortMode);
            keys.Add((pageNumber, key));
        }

        return keys
            .OrderBy(x => x.Key, StringComparer.OrdinalIgnoreCase)
            .ThenBy(x => x.PageNumber)
            .Select(x => x.PageNumber)
            .ToArray();
    }

    private static string ExtractSortKey(string pageText, SortMode sortMode)
    {
        if (string.IsNullOrWhiteSpace(pageText))
        {
            return string.Empty;
        }

        Regex regex = sortMode switch
        {
            SortMode.Pickup => new Regex(@"(?i)\bpickup(?:\s*id)?\s*[:#-]?\s*([A-Z0-9-]+)\b", RegexOptions.Compiled),
            SortMode.Sku => new Regex(@"(?i)\bsku\s*[:#-]?\s*([A-Z0-9-]+)\b", RegexOptions.Compiled),
            SortMode.OrderNumber => new Regex(@"(?i)\border(?:\s*(?:id|no|number))?\s*[:#-]?\s*([A-Z0-9-]+)\b", RegexOptions.Compiled),
            _ => new Regex("$a", RegexOptions.Compiled)
        };

        var match = regex.Match(pageText);
        if (match.Success && match.Groups.Count > 1)
        {
            return match.Groups[1].Value.Trim();
        }

        return string.Empty;
    }
}
