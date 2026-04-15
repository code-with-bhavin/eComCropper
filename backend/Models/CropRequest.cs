namespace EComCropper.Api.Models;

public class CropRequest
{
    public required IFormFile File { get; init; }
    public required string Platform { get; init; }
}
