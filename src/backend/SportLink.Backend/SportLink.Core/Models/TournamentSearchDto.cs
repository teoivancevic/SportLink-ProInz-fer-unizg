﻿namespace SportLink.Core.Models;

public class TournamentSearchDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime TimeFrom { get; set; }
    public DateTime TimeTo { get; set; }
    public decimal EntryFee { get; set; }
    public string Location { get; set; }
    public string OrganizationName { get; set; }
    public string SportName { get; set; }
    public int OrganizationId { get; set; }
}