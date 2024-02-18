using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : ControllerBase
    {

        [HttpGet("GetVersion")]
        public string GetVersion()
        {
            return Constants.BACKEND_VERSION;
        }

    }
}
