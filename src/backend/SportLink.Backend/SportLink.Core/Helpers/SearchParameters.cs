namespace SportLink.Core.Helpers;

public class SearchParameters
{
    public string? SearchTerm { get; set; }
    public List<int>? SportIds { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}