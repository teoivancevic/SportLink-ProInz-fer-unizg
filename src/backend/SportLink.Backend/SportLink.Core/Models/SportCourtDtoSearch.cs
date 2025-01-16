namespace SportLink.Core.Models;

public class SportCourtDtoSearch
{
    public int Id { get; set; }
    public int AvailableCourts { get; set; }
    public string SportName { get; set; }
    public decimal MinHourlyPrice { get; set; }
    public decimal MaxHourlyPrice { get; set; }
}