using SportLink.Core.Enums;

namespace SportLink.Core.Helpers;

public class TrainingGroupSearchParameters : SearchParameters
{
    public SexEnum? Sex { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    
    
}