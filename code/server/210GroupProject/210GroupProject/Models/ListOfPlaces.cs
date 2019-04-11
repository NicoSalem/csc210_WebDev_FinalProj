using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace _210GroupProject.Models
{
    public class ListOfPlaces
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public User User { get; set; }
        public List<Place> LOfPlaces { get; set; }
        public bool isPublished { get; set; }
    }
}
