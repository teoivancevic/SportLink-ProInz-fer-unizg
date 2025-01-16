namespace SportLink.Core.Helpers;

public class TournamentSearchParameters : SearchParameters
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}