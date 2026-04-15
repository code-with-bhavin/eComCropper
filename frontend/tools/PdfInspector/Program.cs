using iText.Kernel.Geom;
using iText.Kernel.Pdf;

foreach (var path in args)
{
    Console.WriteLine($"FILE: {path}");
    using var reader = new PdfReader(path);
    using var pdf = new PdfDocument(reader);

    Console.WriteLine($"Pages: {pdf.GetNumberOfPages()}");

    for (var i = 1; i <= pdf.GetNumberOfPages(); i++)
    {
        var page = pdf.GetPage(i);
        Console.WriteLine($"Page {i}");
        Console.WriteLine($"  page = {Format(page.GetPageSize())}");
        Console.WriteLine($"  crop = {Format(page.GetCropBox())}");
        Console.WriteLine($"  media = {Format(page.GetMediaBox())}");
    }
}

static string Format(Rectangle rectangle) =>
    $"[{rectangle.GetX()}, {rectangle.GetY()}, {rectangle.GetWidth()}, {rectangle.GetHeight()}]";
