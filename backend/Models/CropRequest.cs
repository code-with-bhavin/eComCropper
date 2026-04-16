namespace EComCropper.Api.Models;

public class CropRequest
{
    // `File` kept for backward compatibility with earlier clients.
    public IFormFile? File { get; init; }

    // Preferred field for multi-file support.
    public List<IFormFile> Files { get; init; } = [];

    public required string Platform { get; init; }
    public bool KeepInvoiceOnSeparatePage { get; init; }

    // Options (primarily for Meesho).
    public bool PickupSorting { get; init; }
    public bool SkuSorting { get; init; }
    public bool OrderNumberSorting { get; init; }
    public bool ReturnOriginalWithInvoice { get; init; }
    public string? LabelText { get; init; }
}
