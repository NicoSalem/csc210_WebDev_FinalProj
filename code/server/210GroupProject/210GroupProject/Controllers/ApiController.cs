using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using _210GroupProject.Models;
using Microsoft.AspNetCore.Mvc;

namespace _210GroupProject.Controllers
{
    [Route("api")]
    [ApiController]
    public class ApiController : Controller
    {
        public IActionResult Get()
        {
            using(var db = new Database())
            {
                db.Add(new ListOfPlaces { User = null, LOfPlaces = null });
                db.SaveChanges(); 
                return Ok(db.DbOfLists.ToList<ListOfPlaces>()); 
            }
        }
    }
}