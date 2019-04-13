using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace _210GroupProject.Models {
    public class Database : Microsoft.EntityFrameworkCore.DbContext {
        public DbSet<ListOfPlaces> Lists { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Place> Places { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder ob) {
            ob.UseSqlite("Data source=list.db");
        }
    }
}
