using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {

        [HttpGet("GetInfo")]
        public string GetInfo()
        {
            return "Some info...";
        }

    }
}
