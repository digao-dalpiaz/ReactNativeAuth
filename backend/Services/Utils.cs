namespace backend.Services
{
    public class Utils
    {

        public static int CompareVersions(string a, string b)
        {
            var partsA = a.Split('.');
            var partsB = b.Split('.');

            if (partsA.Length != partsB.Length) throw new Exception("Versions contains different parts quantity");

            for (int i = 0; i < partsA.Length; i++)
            {
                int numA = int.Parse(partsA[i]);
                int numB = int.Parse(partsB[i]);

                if (numA < numB) return -1;
                if (numA > numB) return 1;
            }

            return 0;
        }

    }
}
