using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace _210GroupProject.Models
{
    public class Database : Microsoft.EntityFrameworkCore.DbContext
    {
       public DbSet<ListOfPlaces> DbOfLists { get; set; }
       public DbSet<User> DbOfUsers { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder ob)
        {
            ob.UseSqlite("Data source=list.db");
        }
    }
}
