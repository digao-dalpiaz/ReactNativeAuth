using backend.Exceptions;
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
            throw new Validation("erro de teste");
            return "Some info...";
        }

    }
}
