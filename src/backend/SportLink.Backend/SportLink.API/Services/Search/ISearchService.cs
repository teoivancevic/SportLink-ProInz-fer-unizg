using SportLink.Core.Helpers;

namespace SportLink.API.Services.Search;

public interface ISearchService<T, TParameters> where TParameters : SearchParameters
{
    Task<List<T>> SearchAsync(TParameters parameters);
}