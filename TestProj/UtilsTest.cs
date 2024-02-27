using backend.Services;

namespace TestProj
{
    public class UtilsTest
    {
        [Theory]
        [InlineData("1.2.3", "1.2.03", 0)]
        [InlineData("1.03.0", "1.3.0", 0)]
        [InlineData("1.3.0", "1.2.4", 1)]
        [InlineData("2.0", "1.9", 1)]
        [InlineData("3.0.0", "1.9.8", 1)]
        [InlineData("1.0.0.2", "1.0.0.1", 1)]
        [InlineData("1.2.3", "1.2.4", -1)]
        [InlineData("1.9.8", "3.0.0", -1)]
        public void Test_CompareVersions(string version1, string version2, int expectedResult)
        {
            int result = Utils.CompareVersions(version1, version2);
            Assert.Equal(expectedResult, result);
        }
    }
}