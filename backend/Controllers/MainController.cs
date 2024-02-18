using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class MainController : ControllerBase
    {

        [HttpGet("GetInfo")]
        public string GetInfo()
        {
            return "Some info...";
        }

    }
}
