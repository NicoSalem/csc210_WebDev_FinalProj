using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using _210GroupProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _210GroupProject.Controllers {
    [ApiController]
    public class ApiController : Controller {
        //TODO: GET user given id 
        [HttpGet("api/user/{Id}")]
        public ActionResult GetUser([Required] int Id) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using (var db = new Database()) {
                var user = db.Users.Where(u => u.Id == Id).FirstOrDefault();
                if (user == null)
                    return BadRequest("user not found");
                return Ok(user);
            }

        }

        //TODO: POST create user and return an id 

        [HttpPost("api/user")]
        public ActionResult<int> CreateUser([FromBody] User user) {
            if (!ModelState.IsValid)
                return BadRequest("Bad user");

            using (var db = new Database()) {
                db.Users.Add(user);
                db.SaveChanges();
                return Ok(user.Id);
            }
        }

        //TODO: GET LIST BY ID
        [HttpGet("api/list/{id}")]
        public ActionResult<int> GetList([Required] int id) {
            if (!ModelState.IsValid)
                return BadRequest("Bad user");

            using (var db = new Database()) {
                var list = db.Lists
                    .Where(l => l.Id == id)
                    .Include(l => l.User).
                    FirstOrDefault();
                if (list == null)
                    return BadRequest("list not found");
                var places = db.Places.Where(p => p.ListId == id).ToList<Place>();
                list.Places = places;
                return Ok(list);
            }
        }

        //TODO: publish list by id 
        [HttpGet("api/list/publish/{id}")]
        public ActionResult<int> PublishLis([Required] int id) {
            if (!ModelState.IsValid)
                return BadRequest("Bad user");

            using (var db = new Database()) {
                var list = db.Lists
                    .Where(l => l.Id == id)
                    .FirstOrDefault();
                if (list == null)
                    return BadRequest("list not found");
                list.IsPublished = true;
                db.SaveChanges();
                return Ok(list);
            }
        }

        //TODO: POST create A LIST return list id 
        [HttpPost("api/lists")]
        public ActionResult CreateList([FromBody] ListOfPlaces listOfPlaces) {
            using (var db = new Database()) {
                var user = db.Users.Where(u => u.Id == listOfPlaces.UserId).FirstOrDefault();
                if (user == null)
                    return BadRequest("bad user id");
                ListOfPlaces list = new ListOfPlaces() { User = user, ListTitle = listOfPlaces.ListTitle };
                db.Lists.Add(list);
                db.SaveChanges();
                return Ok(list.Id);
            }
        }

        //TODO: get all lists 
        [HttpGet("api/lists")]
        public ActionResult GetAllLists() {
            using (var db = new Database()) {
                var lists = db.Lists
                    .Where(l => l.IsPublished)
                    .Include(l => l.User)
                    .ToList<ListOfPlaces>();
                if (lists.Count == 0) {
                    return BadRequest("no accounts");
                }
                List<List<string>> thumbs = new List<List<string>>();
                foreach (ListOfPlaces list in lists) {
                    var places = db.Places.Where(p => p.ListId == list.Id);
                    List<string> listThumbs = new List<string>();
                    foreach (Place p in places) {
                        if (listThumbs.Count == 4)
                            break;
                        listThumbs.Add(p.ImageURL);
                    }
                    thumbs.Add(listThumbs);
                }
                return Ok(new { lists, thumb = thumbs });
            }
        }

        //TODO: get all the lists of user id 
        [HttpGet("api/lists/{id}")]
        public ActionResult GetAllListsOfID(int id) {
            using (var db = new Database()) {
                var lists = db.Lists
                    .Where(l => l.UserId == id)
                    .Include(l => l.User)
                    .ToList<ListOfPlaces>();
                if (lists.Count == 0) {
                    return Ok(new { lists });
                }
                List<List<string>> thumbs = new List<List<string>>();
                foreach (ListOfPlaces list in lists) {
                    var places = db.Places.Where(p => p.ListId == list.Id);
                    List<string> listThumbs = new List<string>(); 
                    foreach (Place p in places) {
                        listThumbs.Add(p.ImageURL);
                        if (listThumbs.Count == 4)
                            break;
                    }
                    thumbs.Add(listThumbs); 
                }
                return Ok(new { lists, thumb = thumbs });
            }
        }

        //TODO: get remove list return ok
        [HttpGet("api/lists/remove/{id}")]
        public ActionResult RemoveList(int id) {
            using (var db = new Database()) {
                var list = db.Lists.Where(l => l.Id == id).FirstOrDefault();
                if (list == null)
                    return BadRequest("did not find list to be deleted");
                db.Lists.Remove(list);
                db.SaveChanges();
                return Ok("List was deleted");
            }
        }

        //TODO: post add to list 
        [HttpPost("api/place")]
        public ActionResult CreatePlace([FromBody] Place place) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            using (var db = new Database()) {
                var list = db.Lists.Where(l => l.Id == place.ListId).FirstOrDefault();
                if (list == null)
                    return BadRequest("list doesn't exist");
                db.Places.Add(place);
                db.SaveChanges();

            }
            return Ok(place.ListId);
        }

        [HttpGet("api/place/{Id}")]
        public ActionResult GetPlace(int Id) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            using (var db = new Database()) {
                var place = db.Places.Where(p => p.Id == Id).FirstOrDefault();
                if (place == null)
                    return BadRequest("place not found");
                return Ok(place);
            }
        }
        //TODO: get remove item from list return list id 
        [HttpGet("api/place/remove/{id}")]
        public ActionResult RemovePlace(int id) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            using (var db = new Database()) {
                var place = db.Places.Where(p => p.Id == id).FirstOrDefault();
                if (place == null)
                    return BadRequest("place not found");
                db.Places.Remove(place);
                db.SaveChanges();
                return Ok("place was deleted");
            }
        }

        [HttpGet("/api/yelp")]
        public async Task<string> GetData([FromQuery] string Term, [FromQuery] string Location, [FromQuery] string Categories) {
            string BaseURL = $"https://api.yelp.com/v3/businesses/search?term={Term}&location={Location}&categories={Categories}&limit=10";
            string ApiKey = "Bearer 1fb4Ta4mO9TC412qLRAbFhy8O5tAczd62HKFywqIE2GOIW5NR-jRV88XJ7IIvRuMOdXAm0fYlUQhYZC4c-a0HWlu572yMMOZuAOhDlkSxjzogZpJSYMfB_Vt3a-jXHYx";
            var request = new HttpRequestMessage(HttpMethod.Get, BaseURL);
            request.Headers.Add("Authorization", ApiKey);
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage res = await client.SendAsync(request))
            using (HttpContent content = res.Content) {
                string data = await content.ReadAsStringAsync();
                return data;
            }
        }
    }
}