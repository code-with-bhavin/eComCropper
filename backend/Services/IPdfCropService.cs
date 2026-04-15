namespace EComCropper.Api.Services;

public interface IPdfCropService
{
    Task<MemoryStream> CropAsync(Stream inputPdfStream, string platform, CancellationToken cancellationToken = default);
}
