﻿using backend.Exceptions;
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

        [Authorize(Roles = "prof")]
        [HttpGet("GetInfoOnlyProf")]
        public string GetInfoOnlyProf()
        {
            return "Only for prof role!";
        }

        [HttpPost("TestError")]
        public string TestError()
        {
            throw new Exception("Test internal error");
        }

        [HttpPost("TestValidation")]
        public string TestValidation()
        {
            throw new Validation("Some field invalid");
        }

    }
}
