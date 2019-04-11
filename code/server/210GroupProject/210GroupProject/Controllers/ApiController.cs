using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using _210GroupProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _210GroupProject.Controllers
{
    [Route("api")]
    [ApiController]
    public class ApiController : Controller
    {
        //TODO: GET user given id 
        [HttpGet("/get/user/{Id}")]
        public ActionResult GetUser([Required] int Id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); 
                
            using (var db = new Database())
            {
                var user = db.DbOfUsers.Where(u => u.Id == Id).FirstOrDefault();
                if (user == null)
                    return BadRequest("user not found"); 
                return Ok(user); 
            }
        }

        //TODO: POST create user and return an id 

        [HttpPost("createUser")]
        public ActionResult<int> CreateUser([FromBody] User user)
        {
            if(!ModelState.IsValid)
                return BadRequest("Bad user");

            using (var db = new Database())
            {
                db.DbOfUsers.Add(user);
                db.SaveChanges();
                return Ok(user.Id);
            }
        }
        
        //TODO: GET LIST BY ID
        
        [HttpGet("getList")]
        public ActionResult<int> getList([Required] int id)
        {
            if(!ModelState.IsValid)
                    return BadRequest("Bad user");

            using (var db = new Database())
            {
                var list = db.DbOfLists.Where(l => l.Id == id)
                    .Include(l => l.User).
                    FirstOrDefault();
                
                if (list == null)
                    return BadRequest("user not found"); 
                return Ok(list); 
            }
        }
        
        //TODO: POST create A LIST return list id 
        [HttpPost("createlist")]
        public ActionResult CreateList([FromBody][Required] int Id)
        {
            using(var db = new Database())
            {
                var user = db.DbOfUsers.Where(u => u.Id == Id).FirstOrDefault();
                if (user == null)
                    return BadRequest("bad user id");
                ListOfPlaces list = new ListOfPlaces() { LOfPlaces = new List<Place>(), User = user };
                db.DbOfLists.Add(list);
                db.SaveChanges(); 
                return Ok(list.Id); 
            }
        }

        //TODO: get all lists 
        [HttpGet("getAllLists")]
        public ActionResult getAllLists()
        {
            using(var db = new Database())
            {
                var lists = db.DbOfLists.ToList<ListOfPlaces>();
                if(lists.Count == 0)
                {
                    return BadRequest("no accounts");
                }
                return Ok(lists);
            }
        }
        //TODO: post add to list 
        [HttpPost("list/addplace")]
        public ActionResult CreateAndAddPlace([FromBody] Place place)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            using (var db = new Database())
            {
                var list = db.DbOfLists.Where(l => l.Id == place.ListId).FirstOrDefault();
                if (list == null)
                    return BadRequest("list doesn't exist");

                if (list.LOfPlaces == null)
                    list.LOfPlaces = new List<Place>();
                list.LOfPlaces.Add(place);
                db.DbOfLists.Update(list);
                db.SaveChanges(); 

            }
            return Ok(place.ListId);
        }
        //TODO: get remove item from list return list id 

        //TODO: get remove list return ok
        [HttpGet("removelist")]
        public ActionResult RemoveList(int id)
        {
            using(var db = new Database())
            {
                var lists = db.DbOfLists.ToList<ListOfPlaces>();
                if(lists.Count == 0)
                {
                    return BadRequest("no accounts");
                }
                foreach (ListOfPlaces l in lists)
                {
                     if(l.Id == id)
                     {
                        lists.Remove(l);
                        db.SaveChanges();
                        return Ok(lists);
                     }
                }
                return BadRequest("did not find list to be deleted");
            }
        } 
    }
 
}