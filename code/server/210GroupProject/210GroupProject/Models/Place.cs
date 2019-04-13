using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace _210GroupProject.Models {
    public class Place {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string YelpId { get; set; }
        [Required]
        public int ListId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string Phone { get; set; }
        public int Rating { get; set; }
        public string PriceRange { get; set; }
        [Required]
        public string URL { get; set; }
        [Required]
        public string ImageURL { get; set; }
    }
}
