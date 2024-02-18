using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : ControllerBase
    {

        [HttpGet]
        public string GetVersion()
        {
            return Constants.BACKEND_VERSION;
        }

    }
}
