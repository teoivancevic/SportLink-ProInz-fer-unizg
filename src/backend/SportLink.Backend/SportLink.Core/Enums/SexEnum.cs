using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SportLink.Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SexEnum
{
    [Description("Male")]
    Male = 0,
    
    [Description("Female")]
    Female = 1,
    
    [Description("Unisex")]
    Unisex = 2
}