using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Enums;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.OpenApi.Models;

namespace SportLink.Core.Helpers;

public class TrainingGroupSearchParameters : SearchParameters
{
    /// <summary>
    /// 0 - Male, 1 - Female, 2 - Unisex
    /// </summary>
    [SwaggerParameter(
        Description = "Filter training groups by sex (0 = Male, 1 = Female, 2 = Unisex)\n" +
                      "Oznacuj sa CTRL + klik na enum")]
    //[ModelBinder(BinderType = typeof(CommaSeparatedModelBinder))]
    public List<SexEnum>? Sex { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    
    
}