import RAcademyLayout from "@/components/layouts/RAcademyLayout";

const eligibilityData = [
  { entry: "NDA & NA (UPSC)", gender: "Both", age: "16½ to 19½ yrs", qualification: "Army: 10+2 | Navy & Air Force: 10+2 (PCM)", academy: "NDA → IMA/NA/AFA", duration: "3 yrs + 1 yr" },
  { entry: "10+2 TES (Non-UPSC)", gender: "Men", age: "16½ to 19½ yrs", qualification: "10+2: 60% in PCM + JEE Mains rank", academy: "MCEME", duration: "3 yrs + 1 yr" },
  { entry: "Direct Entry (UPSC)", gender: "Men", age: "19 to 24 yrs", qualification: "Army: Graduate | Navy: Engr Graduate | Air Force: 10+2 Phy & Maths or BE", academy: "IMA/NA/AFA", duration: "18 months / 74 weeks" },
  { entry: "SSC (Non-Tech)", gender: "Both", age: "19 to 25 yrs", qualification: "Graduate", academy: "OTA, Chennai", duration: "49 weeks" },
  { entry: "INET", gender: "Both", age: "19 to 24 yrs", qualification: "BE/B.Tech with 60%", academy: "NA, Ezhimala", duration: "1½ to 2 yrs" },
  { entry: "SSC - AFCAT", gender: "Both", age: "Flying: 20-24 | Ground: 20-26", qualification: "10+2: 50% in Phy & Maths | Graduation: 60%", academy: "AFA", duration: "52-74 weeks" },
  { entry: "SSC (JAG)", gender: "Both", age: "21 to 27 yrs", qualification: "LAW Graduate with 55% + CLAT PG Score", academy: "OTA, Chennai", duration: "49 weeks" },
  { entry: "TGC", gender: "Men", age: "20 to 27 yrs", qualification: "BE/B.Tech in notified stream", academy: "IMA", duration: "1 yr" },
];

const RAcademyEligibility = () => (
  <RAcademyLayout>
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-olive mb-8 text-center">Eligibility Criteria</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-olive text-white">
              <tr>{["Entry", "Gender", "Age", "Qualification", "Training Academy", "Duration"].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-sm font-semibold">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {eligibilityData.map((row, i) => (
                <tr key={i} className="border-b border-olive/10 hover:bg-olive/5">
                  <td className="px-4 py-3 font-medium text-olive">{row.entry}</td>
                  <td className="px-4 py-3 text-sm">{row.gender}</td>
                  <td className="px-4 py-3 text-sm">{row.age}</td>
                  <td className="px-4 py-3 text-sm">{row.qualification}</td>
                  <td className="px-4 py-3 text-sm">{row.academy}</td>
                  <td className="px-4 py-3 text-sm">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </RAcademyLayout>
);

export default RAcademyEligibility;
