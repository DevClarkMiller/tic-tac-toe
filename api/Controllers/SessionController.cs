using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SessionController : ControllerBase {
        [HttpPost]
        public IActionResult CreateSession() {
            var sessionId = Guid.NewGuid().ToString();
            return Ok(new{ sessionId });
        }
    }
}
