namespace EComCropper.Api.Models;

public sealed class FlipkartCropRequest
{
    // `File` kept for backward compatibility with earlier clients.
    public IFormFile? File { get; init; }

    // Preferred field for multi-file support.
    public List<IFormFile> Files { get; init; } = [];

    // Processing option.
    // false => Remove Invoice
    // true  => Remove Invoice With Extra Space (from label)
    public bool RemoveInvoiceWithExtraSpace { get; init; }
}

