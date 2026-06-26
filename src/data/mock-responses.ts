export function mockFetchResponse(query: string) {
  return {
    summary: "To register a sole proprietorship in Douala, you'll need to complete 4 main steps involving the Trade Registry, Tax Office, and Social Insurance. Total time is approximately 2-4 weeks.",
    totalTime: "2-4 weeks",
    totalCost: "45,000 – 80,000 FCFA",
    steps: [
      {
        stepNumber: 1,
        title: "Obtain Certificate of Non-Conviction",
        description: "Visit the Centre de Casier Judiciaire at the Court of First Instance. Submit your national ID and 2 passport photos (white background).",
        documents: ["National ID", "2 passport photos (white background)", "5,000 FCFA stamp"],
        time: "1-3 days",
        cost: "~6,000 FCFA",
        risk: "Photos with colored backgrounds will be rejected.",
        sources: [1, 2]
      },
      {
        stepNumber: 2,
        title: "Register with the Trade Registry (RCCM)",
        description: "Submit the certificate of non-conviction, a lease agreement or title deed for your business location, and complete the RCCM application form.",
        documents: ["Certificate of Non-Conviction", "Lease agreement / title deed", "RCCM application form", "Passport photos"],
        time: "3-7 days",
        cost: "25,000 – 50,000 FCFA",
        risk: "Incomplete RCCM form causes delays of 1-2 weeks.",
        sources: [3]
      },
      {
        stepNumber: 3,
        title: "Obtain Tax Identification Number (Taxpayer Card)",
        description: "After RCCM, proceed to the Tax Centre (Centre des Impôts) to declare your business and receive your Tax ID.",
        documents: ["RCCM registration certificate", "National ID"],
        time: "1-2 days",
        cost: "Free",
        risk: "",
        sources: [4]
      },
      {
        stepNumber: 4,
        title: "Register with the National Social Insurance Fund (CNPS)",
        description: "If you will have employees, you must register with CNPS. Self-employed individuals can optionally register.",
        documents: ["RCCM certificate", "Tax ID card", "Company stamp"],
        time: "1 week",
        cost: "Varies based on income",
        risk: "Failure to register can result in fines.",
        sources: [5]
      }
    ],
    commonMistakes: [
      "Submitting passport photos with non-white background for the certificate of non-conviction.",
      "Using a residential lease that does not mention commercial usage.",
      "Delaying the RCCM after obtaining the certificate of non-conviction (certificate expires in 3 months)."
    ],
    sources: [
      {
        title: "Ministry of Justice Circular No. X, 2023",
        url: "#",
        snippet: "Procedure for requesting a certificate of non-conviction..."
      },
      {
        title: "Cameroon Trade Portal – RCCM Registration",
        url: "#",
        snippet: "The Registre du Commerce et du Crédit Mobilier..."
      },
      {
        title: "Centre des Impôts – Business Tax Registration",
        url: "#",
        snippet: "Obligations for obtaining a Taxpayer Identification..."
      },
      {
        title: "CNPS Official Website – Employer Registration",
        url: "#",
        snippet: "How to register with the National Social Insurance Fund..."
      },
      {
        title: "Cameroon Business Handbook 2024",
        url: "#",
        snippet: "Comprehensive guide to business registration steps..."
      }
    ]
  };
}
