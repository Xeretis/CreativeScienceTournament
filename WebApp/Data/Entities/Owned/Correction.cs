using Microsoft.EntityFrameworkCore;

namespace WebApp.Data.Entities.Owned;

[Owned]
public class Correction
{
    public int Points { get; set; }
    public string Comment { get; set; }
}