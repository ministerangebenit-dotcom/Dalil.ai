export function mockFetchResponse(_query: string) {
  return {
    sovereignVerified: true,
    summary: "Registering a sole proprietorship in Cameroon involves 4 official steps across three institutions: the Court Registry, the Tax Centre, and CNPS. Total duration is 2–4 weeks at a cost of 45,000–80,000 FCFA.",
    totalTime: "2–4 weeks",
    totalCost: "45,000 – 80,000 FCFA",
    steps: [
      {
        stepNumber: 1,
        title: "Obtain your Certificate of Non-Conviction",
        description: "Visit the Centre de Casier Judiciaire at the Court of First Instance in your city. Submit your national ID and passport photos with strictly white background.",
        documents: ["National ID card", "2 passport photos (white bg)", "5,000 FCFA stamp fee"],
        time: "1–3 business days",
        cost: "~6,000 FCFA",
        risk: "Photos with non-white backgrounds are rejected immediately — you must restart the entire process.",
        sources: [1, 2],
        type: 'standard' as const,
      },
      {
        stepNumber: 2,
        title: "Loi No. 2010/001 — Commercial Registration Act",
        description: "Under Article 14 of the OHADA Uniform Act on Commercial Law, all commercial entities must register with the RCCM. This legal decree mandates the submission of non-conviction certificates and proof of domicile.",
        documents: ["Certificate of Non-Conviction", "Lease agreement (commercial usage)", "RCCM application form", "Passport photos"],
        time: "3–7 business days",
        cost: "25,000 – 50,000 FCFA",
        risk: "Incomplete RCCM form causes 1–2 week delays. An incomplete file is returned without processing.",
        sources: [3],
        type: 'law' as const,
      },
      {
        stepNumber: 3,
        title: "Obtain your Tax Identification Number (NIU)",
        description: "After receiving your RCCM certificate, proceed to your local Centre des Impôts to declare your business activity and receive your Numéro d'Identifiant Unique.",
        documents: ["RCCM registration certificate", "National ID card"],
        time: "1–2 business days",
        cost: "Free",
        risk: "",
        sources: [4],
        type: 'standard' as const,
      },
      {
        stepNumber: 4,
        title: "Direction Régionale des Impôts — Yaoundé Centre",
        description: "Official tax authority office for NIU registration and tax compliance in Yaoundé. Open Monday–Friday, 08h00–15h30. Contact: +237 222 22 33 44. Address: Avenue de l'Indépendance, Yaoundé.",
        documents: ["RCCM certificate", "NIU tax card", "Company stamp"],
        time: "5–7 business days",
        cost: "Varies by income",
        risk: "Failure to register employees with CNPS within 8 days of hiring incurs significant fines.",
        sources: [5],
        type: 'contact' as const,
      }
    ],
    commonMistakes: [
      "Submitting passport photos with a coloured or grey background — strictly white background required for the Certificate of Non-Conviction.",
      "Using a residential lease that does not mention commercial usage — it will be rejected at the RCCM.",
      "Waiting too long after obtaining the Certificate of Non-Conviction — it expires after 3 months, invalidating your entire file."
    ],
    sources: [
      { title: "MINFI — Business Creation Space", url: "https://minfi.gov.cm/en/business-creation-space-in-the-republic-of-cameroon/", snippet: "Official Ministry of Finance guide to creating a business in Cameroon.", domain: "minfi.gov.cm", isOfficial: true },
      { title: "MINFI — Enterprise Setup Formalities", url: "https://minfi.gov.cm/en/formalities-for-setting-up-an-enterprise-in-cameroon/", snippet: "Step-by-step administrative formalities for enterprise setup.", domain: "minfi.gov.cm", isOfficial: true },
      { title: "CamcTax — Business Registration Steps", url: "https://camctax.com/learning/business-registration-steps", snippet: "Practical guide covering RCCM, NIU, patente, and CNPS obligations.", domain: "camctax.com", isOfficial: false },
      { title: "Centre des Impôts — NIU Registration", url: "#", snippet: "Official guidance on obtaining your Numéro d'Identifiant Unique and business tax card.", domain: "impots.cm", isOfficial: true },
      { title: "CNPS — Employer Registration", url: "https://www.cnps.cm", snippet: "Official CNPS portal for employer registration and social insurance obligations.", domain: "cnps.cm", isOfficial: true },
    ]
  };
}
