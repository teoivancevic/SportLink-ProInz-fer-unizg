using System.ComponentModel;
using System.Text.Json.Serialization;

namespace SportLink.Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SexEnum
{
    [Description("Male")]
    Male = 1,

    [Description("Female")]
    Female = 2,

    [Description("Unisex")]
    Unisex = 3
}