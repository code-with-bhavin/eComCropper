namespace EComCropper.Api.Services;

public interface IPdfCropService
{
    Task<MemoryStream> CropAsync(
        Stream inputPdfStream,
        string platform,
        bool keepInvoiceOnSeparatePage,
        bool pickupSorting,
        bool skuSorting,
        bool orderNumberSorting,
        string? labelText,
        CancellationToken cancellationToken = default);
}
