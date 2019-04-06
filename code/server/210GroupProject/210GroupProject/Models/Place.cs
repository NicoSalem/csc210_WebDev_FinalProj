using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace _210GroupProject.Models
{
    public class Place
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public int Rating { get; set; }
        public string PriceRange { get; set; }
        public string URL { get; set; }
        public string ImageURL { get; set; }
    }
}
