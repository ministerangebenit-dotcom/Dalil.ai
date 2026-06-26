export function mockFetchResponse(_query: string) {
  return {
    summary: "Registering a sole proprietorship in Cameroon involves 4 official steps across three institutions: the Court Registry, the Tax Centre, and CNPS. Expect 2–4 weeks total and costs between 45,000 and 80,000 FCFA.",
    totalTime: "2–4 weeks",
    totalCost: "45,000 – 80,000 FCFA",
    steps: [
      {
        stepNumber: 1,
        title: "Obtain your Certificate of Non-Conviction",
        description: "Visit the Centre de Casier Judiciaire at the Court of First Instance in your city. Bring your national ID and passport photos. This certificate proves you have no criminal record.",
        documents: ["National ID card", "2 passport photos (white background)", "5,000 FCFA stamp fee"],
        time: "1–3 business days",
        cost: "~6,000 FCFA",
        risk: "Photos with non-white backgrounds are rejected immediately — you will have to restart.",
        sources: [1, 2]
      },
      {
        stepNumber: 2,
        title: "Register with the Trade Registry (RCCM)",
        description: "Submit your documents at the Registre du Commerce et du Crédit Mobilier. You will receive your RCCM number, which is your official business identity in Cameroon.",
        documents: ["Certificate of Non-Conviction", "Lease or title deed for business address", "RCCM application form", "Passport photos"],
        time: "3–7 business days",
        cost: "25,000 – 50,000 FCFA",
        risk: "An incomplete RCCM form causes 1–2 week delays. Double-check all fields before submission.",
        sources: [3]
      },
      {
        stepNumber: 3,
        title: "Obtain your Tax Identification Number (NIU)",
        description: "After receiving your RCCM certificate, proceed to your local Centre des Impôts. Declare your business activity and receive your Numéro d'Identifiant Unique (NIU), required for all fiscal operations.",
        documents: ["RCCM registration certificate", "National ID card"],
        time: "1–2 business days",
        cost: "Free",
        risk: "",
        sources: [4]
      },
      {
        stepNumber: 4,
        title: "Register with CNPS (if you have employees)",
        description: "If you plan to hire staff, you must register with the Caisse Nationale de Prévoyance Sociale. Self-employed individuals may register voluntarily for social coverage.",
        documents: ["RCCM certificate", "NIU tax card", "Company stamp"],
        time: "5–7 business days",
        cost: "Varies by declared income",
        risk: "Failure to register employees with CNPS within 8 days of hiring can result in significant fines.",
        sources: [5]
      }
    ],
    commonMistakes: [
      "Submitting passport photos with a coloured or grey background — the Certificate of Non-Conviction requires a strictly white background.",
      "Using a residential lease agreement that does not mention commercial usage — it will be rejected at the RCCM.",
      "Waiting too long after getting the Certificate of Non-Conviction — it expires after 3 months, invalidating your entire file."
    ],
    sources: [
      { title: "MINFI — Business Creation Space", url: "https://minfi.gov.cm/en/business-creation-space-in-the-republic-of-cameroon/", snippet: "Official Ministry of Finance guide to creating a business in Cameroon, including required documents and administrative steps." },
      { title: "MINFI — Enterprise Setup Formalities", url: "https://minfi.gov.cm/en/formalities-for-setting-up-an-enterprise-in-cameroon/", snippet: "Step-by-step administrative formalities for setting up an enterprise, from investment declaration to labour registration." },
      { title: "CamcTax — Business Registration Steps", url: "https://camctax.com/learning/business-registration-steps", snippet: "Practical guide covering RCCM registration, NIU tax number, patente, and CNPS obligations for Cameroonian businesses." },
      { title: "Centre des Impôts — Tax Registration", url: "#", snippet: "Official tax authority guidance on obtaining a Numéro d'Identifiant Unique (NIU) and business tax card." },
      { title: "CNPS — Employer Registration", url: "https://www.cnps.cm", snippet: "Official CNPS portal for employer registration, contribution schedules, and social insurance obligations." }
    ]
  };
}
