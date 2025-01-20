using Swashbuckle.AspNetCore.Annotations;

namespace SportLink.Core.Helpers;

public class SearchParameters
{
    public string? SearchTerm { get; set; }
    [SwaggerParameter(Description = "List of searched sport IDs, example: 1 - Football, 2 - Basketball")]
    public List<int>? SportIds { get; set; }
    public decimal? MaxPrice { get; set; }
}