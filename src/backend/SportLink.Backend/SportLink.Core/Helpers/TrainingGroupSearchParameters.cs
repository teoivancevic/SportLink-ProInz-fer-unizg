using SportLink.Core.Enums;
using Swashbuckle.AspNetCore.Annotations;

namespace SportLink.Core.Helpers;

public class TrainingGroupSearchParameters : SearchParameters
{
    /// <summary>
    /// 0 - Male, 1 - Female, 2 - Unisex
    /// </summary>
    [SwaggerParameter(Description = "Filter training groups by sex (0 = Male, 1 = Female, 2 = Unisex)")]
    public List<SexEnum>? Sex { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    
    
}