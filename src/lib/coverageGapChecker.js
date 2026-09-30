// Coverage-gap checker logic. Pure functions: no DOM, no network, nothing
// stored. Every rule cites a source and carries that source's verification
// status. State minimum liability limits and their sources are read from
// auto-min-limits.json (generated from DATA/insurance_rules.db by
// scripts/export-rules.mjs) instead of being copied here by hand — run
// `npm run data:export` to refresh it after the database changes.
import minLimitsData from "../data/rules/auto-min-limits.json";

export const LAST_VERIFIED = minLimitsData.limits.CA?.lastVerified ?? "unknown";

const L = minLimitsData.limits;

export const SRC = {
  cadmv: { name: L.CA.sourceName, url: L.CA.sourceUrl, status: "Primary source" },
  cdi101: {
    name: "CA Dept of Insurance - Auto insurance guide (Form 101)",
    url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/01-auto/auto101.cfm",
    status: "Primary source",
  },
  tdi: { name: L.TX.sourceName, url: L.TX.sourceUrl, status: "Primary source" },
  flhsmv: { name: L.FL.sourceName, url: L.FL.sourceUrl, status: "Primary source" },
  nydfs: { name: L.NY.sourceName, url: L.NY.sourceUrl, status: "Primary source" },
  cdi401: {
    name: "CA Dept of Insurance - Homeowners and renters guide (Form 401)",
    url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/res-ins-guide.cfm",
    status: "Primary source",
  },
  cdieq: {
    name: "CA Dept of Insurance - Earthquake insurance",
    url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/eq-ins.cfm",
    status: "Primary source",
  },
  cdiflood: {
    name: "CA Dept of Insurance - Flood insurance resources",
    url: "https://www.insurance.ca.gov/01-consumers/140-catastrophes/FloodFacts.cfm",
    status: "Primary source",
  },
  cea: {
    name: "California Earthquake Authority - Homeowners policies",
    url: "https://www.earthquakeauthority.com/california-earthquake-insurance-policies/homeowners",
    status: "Primary source",
  },
  tdihome: {
    name: "Texas Dept of Insurance - Home insurance guide (CB025)",
    url: "https://www.tdi.texas.gov/pubs/consumer/cb025.html",
    status: "Primary source",
  },
  tdiblog: {
    name: "Texas Dept of Insurance - Home and property blog",
    url: "https://tdi.texas.gov/blog/category/home-property.html",
    status: "Primary source",
  },
  twia: {
    name: "TWIA - Flood insurance requirements",
    url: "https://www.twia.org/flood-requirement/",
    status: "Primary source",
  },
  fldfs: {
    name: "Florida DFS - Florida's hurricane deductible",
    url: "https://www.myfloridacfo.com/division/consumers/consumerprotections/floridashurricanedeductible",
    status: "Primary source",
  },
  fl627: {
    name: "Florida Statutes 627.701 - deductibles",
    url: "https://codes.findlaw.com/fl/title-xxxvii-insurance/fl-st-sect-627-701/",
    status: "Primary source",
  },
  citflood: {
    name: "Coverage Classroom - Citizens flood requirement phase-in (quotes s. 627.351(6)(aa))",
    url: "https://coverageclassroom.com/learn/citizens-flood-insurance-requirement",
    status: "Secondary - unverified",
  },
};

export const AUTO = {
  CA: {
    name: L.CA.name,
    min: { bipp: L.CA.bipp, bipa: L.CA.bipa, pd: L.CA.pd },
    guide: "cdi101",
    minSrc: ["cadmv"],
    liabNote: "cdi101",
  },
  TX: {
    name: L.TX.name,
    min: { bipp: L.TX.bipp, bipa: L.TX.bipa, pd: L.TX.pd },
    guide: "tdi",
    minSrc: ["tdi"],
    liabNote: "tdi",
  },
  NY: {
    name: L.NY.name,
    min: { bipp: L.NY.bipp, bipa: L.NY.bipa, pd: L.NY.pd },
    guide: "nydfs",
    minSrc: ["nydfs"],
    liabNote: "nydfs",
  },
  FL: {
    name: L.FL.name,
    min: { bipp: L.FL.bipp, bipa: L.FL.bipa, pd: L.FL.pd },
    guide: "flhsmv",
    minSrc: ["flhsmv"],
    liabNote: null,
  },
};

export function money(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}
export function isNum(x) {
  return typeof x === "number" && isFinite(x);
}

export function autoCheck(v) {
  var st = AUTO[v.state];
  var f = [];
  function add(level, title, what, why, check, cites) {
    f.push({ level: level, title: title, what: what, why: why, check: check, cites: cites || [] });
  }
  if (!st) return f;

  // 1. Minimum liability
  if (v.state === "FL") {
    if (isNum(v.pd) && v.pd < st.min.pd) {
      add(
        "below",
        "Property damage liability below Florida's requirement",
        "You entered " + money(v.pd) + "; Florida requires at least " + money(st.min.pd) + " of property damage liability to register a vehicle.",
        "Florida requires PIP and property damage liability for vehicles with four or more wheels.",
        "Check your declarations page for the property damage limit.",
        ["flhsmv"]
      );
    } else if (isNum(v.pd)) {
      add("ok", "Property damage liability meets Florida's requirement", "You entered " + money(v.pd) + " against a " + money(st.min.pd) + " requirement.", "", "", ["flhsmv"]);
    }
    if (!isNum(v.bipp) || v.bipp === 0) {
      add(
        "watch",
        "No bodily injury liability entered",
        "Florida does not require bodily injury liability for most private vehicles, so having none can be legal.",
        "If you cause a crash that injures someone, you could be personally responsible for their injuries, and a crash can trigger a requirement to prove 10/20 bodily injury coverage after the fact.",
        "Ask your insurer what bodily injury liability would cost and what limits fit the assets you want to protect.",
        ["flhsmv"]
      );
    }
  } else {
    var below = [];
    if (isNum(v.bipp) && v.bipp < st.min.bipp) below.push("injury per person " + money(v.bipp) + " (minimum " + money(st.min.bipp) + ")");
    if (isNum(v.bipa) && v.bipa < st.min.bipa) below.push("injury per accident " + money(v.bipa) + " (minimum " + money(st.min.bipa) + ")");
    if (isNum(v.pd) && v.pd < st.min.pd) below.push("property damage " + money(v.pd) + " (minimum " + money(st.min.pd) + ")");
    if (below.length) {
      add(
        "below",
        "Liability limits below the " + st.name + " minimum",
        "Below the minimum: " + below.join("; ") + ".",
        st.name + " sets minimum liability limits of " + money(st.min.bipp) + "/" + money(st.min.bipa) + "/" + money(st.min.pd) + ".",
        "Check the declarations page. Some states change minimums on set dates, so an older policy may need updating at renewal.",
        st.minSrc
      );
    } else if (isNum(v.bipp) && isNum(v.bipa) && isNum(v.pd)) {
      var nyNote =
        v.state === "NY"
          ? " New York also has higher required limits when an injury results in death ($50,000 per person, $100,000 per accident); this tool only checks the non-death limits."
          : "";
      add("ok", "Liability limits meet the " + st.name + " minimums", "You entered " + money(v.bipp) + "/" + money(v.bipa) + "/" + money(v.pd) + "." + nyNote, "", "", st.minSrc);
    } else {
      add("info", "Enter your liability limits", "Fill in the three liability numbers to check them against the state minimum.", "", "", []);
    }
  }

  // 2. Property damage at the minimum
  if (isNum(v.pd) && st.min.pd && v.pd === st.min.pd) {
    var pdCite = v.state === "NY" ? ["nydfs"] : v.state === "TX" ? ["tdi"] : [];
    add(
      "info",
      "Property damage limit is at the state minimum",
      "Your limit is " + money(v.pd) + ". If you damage someone's newer car, the repair or replacement cost can exceed this and the difference is your responsibility.",
      v.state === "NY"
        ? "New York DFS notes many cars today are worth far more than the $10,000 minimum."
        : v.state === "TX"
          ? "TDI notes minimum limits might be too low if the other driver's car is totaled."
          : "General consideration; not taken from a state rule.",
      "Ask what a higher property damage limit would cost.",
      pdCite
    );
  }

  // 3. Assets vs. injury liability limit
  if (isNum(v.assets) && v.assets > 0 && isNum(v.bipa) && v.bipa > 0 && v.assets > v.bipa) {
    add(
      "watch",
      "Injury liability limit is lower than the assets you want to protect",
      "Your per-accident injury limit is " + money(v.bipa) + " and you listed " + money(v.assets) + " of assets.",
      st.liabNote === "cdi101"
        ? "CDI says the more assets you have, the more you could lose in a lawsuit, and you may want higher limits than the law requires."
        : st.liabNote === "nydfs"
          ? "New York DFS says consumers with assets to protect should seriously consider higher bodily injury limits."
          : st.liabNote === "tdi"
            ? "TDI says if you lack enough liability coverage you might pay the rest out of pocket and the other driver could sue you."
            : "General consideration; not taken from a Florida rule.",
      "Ask about higher liability limits and about an umbrella policy, which adds liability coverage above your auto and home policies.",
      st.liabNote ? [st.liabNote] : []
    );
  }

  // 4. Uninsured / underinsured motorist
  if (v.um === "no") {
    if (v.state === "NY") {
      add("below", "New York requires uninsured motorist coverage", "You answered that you do not carry it.", "New York requires uninsured motorist bodily injury coverage at the same minimum limits as liability, for accidents in New York.", "Check your declarations page or ask your insurer.", ["nydfs"]);
    } else if (v.state === "CA" || v.state === "TX") {
      add(
        "watch",
        "No uninsured/underinsured motorist coverage",
        "You answered that you do not carry it.",
        v.state === "CA"
          ? "California insurers must offer it; you can decline only by signing a waiver. It pays for injuries when the at-fault driver has no insurance or too little."
          : "Texas insurers must offer it; declining requires a written rejection. It pays when you are hit by a driver without insurance or without enough.",
        "Ask whether you signed a rejection and what adding it would cost.",
        [st.guide]
      );
    } else {
      add("info", "Uninsured motorist coverage: not researched for Florida", "This tool has not verified Florida's rules on this coverage.", "", "Ask your insurer what is offered.", []);
    }
  } else if (v.um === "unsure") {
    add("info", "Find out whether you carry uninsured/underinsured motorist coverage", "You were not sure.", "It pays your injuries when the at-fault driver is uninsured or underinsured.", "Look for it on your declarations page.", v.state === "FL" ? [] : [st.guide]);
  }

  // 5. PIP / no-fault
  if (v.state === "NY" && v.pip !== "pip") {
    add(
      v.pip === "unsure" ? "watch" : "below",
      "New York requires basic no-fault (PIP) of $50,000",
      v.pip === "unsure" ? "You were not sure whether you have it." : "You answered that you do not have PIP/no-fault coverage.",
      "New York requires $50,000 of basic no-fault coverage.",
      "Check your declarations page.",
      ["nydfs"]
    );
  }
  if (v.state === "FL" && v.pip !== "pip") {
    add(
      v.pip === "unsure" ? "watch" : "below",
      "Florida requires $10,000 of PIP",
      v.pip === "unsure" ? "You were not sure whether you have it." : "You answered that you do not have PIP.",
      "Florida requires PIP and property damage liability to register a vehicle; PIP pays 80% of necessary medical expenses up to $10,000 regardless of fault.",
      "Check your declarations page.",
      ["flhsmv"]
    );
  }
  if (v.state === "TX" && v.pip === "none") {
    add(
      "info",
      "No PIP on your policy",
      "In Texas, auto policies include PIP unless the insured rejects it in writing.",
      "TDI says all Texas auto policies include PIP and the insured must reject it in writing.",
      "Confirm whether you signed a rejection.",
      ["tdi"]
    );
  }

  // 6. Collision/comprehensive and lenders
  if (v.financed === "yes" && (v.coll === "no" || v.comp === "no")) {
    add(
      "watch",
      "Financed or leased vehicle without collision and comprehensive",
      "You answered that the vehicle is financed or leased and that you lack " + (v.coll === "no" && v.comp === "no" ? "collision and comprehensive" : v.coll === "no" ? "collision" : "comprehensive") + " coverage.",
      "Lenders and lessors typically require both; if you cancel or lose them the lender may buy expensive coverage that protects only the lender.",
      "Check your loan or lease terms and ask your lender.",
      ["tdi", "cdi101"].filter(function (k) {
        return (k === st.guide) || (k === "tdi" && v.state === "TX") || (k === "cdi101" && v.state === "CA");
      })
    );
  }

  // 7. Deductible vs vehicle value; older car note
  if (v.coll === "yes" && isNum(v.vehicleValue) && v.vehicleValue > 0 && isNum(v.deductible) && v.deductible >= 0.5 * v.vehicleValue) {
    add(
      "info",
      "Collision deductible is at least half of the vehicle's value",
      "Deductible " + money(v.deductible) + " against a vehicle value of " + money(v.vehicleValue) + ".",
      "Collision pays up to the car's value minus the deductible, so for a total loss the most you would receive is " + money(Math.max(0, v.vehicleValue - v.deductible)) + ".",
      "Compare the premium for this coverage with that maximum payout.",
      []
    );
  }
  if ((v.coll === "yes" || v.comp === "yes") && v.financed === "no" && isNum(v.vehicleValue) && v.vehicleValue > 0 && v.vehicleValue < 3000) {
    add(
      "info",
      "Collision or comprehensive on a lower-value vehicle",
      "Your vehicle is valued at " + money(v.vehicleValue) + ".",
      v.state === "NY"
        ? "New York DFS says you may reduce costs by raising deductibles or eliminating physical damage coverage on older vehicles."
        : v.state === "CA"
          ? "CDI suggests thinking about dropping comprehensive and/or collision on an older car."
          : "General consideration.",
      "Weigh the premium against what the coverage could pay. This is a choice, not a requirement.",
      v.state === "NY" ? ["nydfs"] : v.state === "CA" ? ["cdi101"] : []
    );
  }
  return f;
}

export var AUTO_QUESTIONS = {
  CA: [
    "Do I qualify for a Good Driver policy (licensed 3+ years, no more than one point, and other criteria)? California requires it to be at least 20% below the non-good-driver rate.",
    "I am 55 or older: does completing a DMV-approved mature driver course reduce my premium, and by how much?",
    "Is my quote a six-month or annual premium? In California a six-month premium must be half the annual premium, with no paid-in-full discount.",
    "Are there mileage-verification programs that lower my premium?",
  ],
  TX: [
    "Which discounts do you offer and how much is each? (Each company decides.)",
    "Do you use my credit score, and how does it affect my price?",
    "Did I sign a written rejection for PIP or uninsured/underinsured coverage, and what would adding them cost?",
    "If you cancel or do not renew, what notice will I get and why?",
  ],
  NY: [
    "Which of the required discounts (accident prevention course, anti-lock brakes, daytime running lamps, anti-theft) are applied, and where are the dollar amounts on my declarations page?",
    "What would Additional PIP or OBEL cost, and do I want Supplementary Uninsured/Underinsured (SUM) coverage at my liability limits?",
    "Is supplemental spousal liability included, and do I want it?",
    "How does your surcharge plan treat my accidents and violations?",
  ],
  FL: [
    "What would bodily injury liability cost at different limits?",
    "Which driver-improvement or safety-course discounts do you offer?",
    "Do you use my credit information, and what notice will I receive?",
    "If you cancel, what notice will I get and how do I appeal to the state?",
  ],
};

export var HOME = {
  CA: { name: "California" },
  TX: { name: "Texas" },
  FL: { name: "Florida" },
};

export function homeCheck(v) {
  var f = [];
  function add(level, title, what, why, check, cites) {
    f.push({ level: level, title: title, what: what, why: why, check: check, cites: cites || [] });
  }
  var st = v.state;
  var guide = st === "CA" ? ["cdi401"] : st === "TX" ? ["tdihome"] : [];

  // 1. Dwelling vs rebuild cost
  if (isNum(v.dwelling) && isNum(v.rebuild) && v.rebuild > 0) {
    var ratio = v.dwelling / v.rebuild;
    if (ratio < 1) {
      add(
        "watch",
        "Dwelling limit is below your estimated rebuild cost",
        "Your dwelling limit " + money(v.dwelling) + " is " + Math.round(ratio * 100) + "% of your estimate of " + money(v.rebuild) + " (a gap of " + money(v.rebuild - v.dwelling) + ").",
        st === "CA"
          ? "CDI says the dwelling limit should be the cost to rebuild, not the purchase price or market value, and that underinsurance and code-upgrade costs were major problems after past wildfires."
          : "The dwelling limit is meant to reflect what it would cost to rebuild. This is a general consideration; the estimate is yours, not an insurer's.",
        "Ask your insurer how its rebuild estimate was produced and whether building-code upgrade coverage is included.",
        guide
      );
    } else {
      add("ok", "Dwelling limit meets your rebuild estimate", "Your limit " + money(v.dwelling) + " against your estimate of " + money(v.rebuild) + ".", "This only reflects the estimate you entered.", "Update the estimate when you renovate or costs change.", guide);
    }
  } else if (isNum(v.dwelling)) {
    add(
      "info",
      "Add a rebuild-cost estimate to check your dwelling limit",
      "Without an estimate this tool cannot compare your limit with the cost to rebuild.",
      st === "CA" ? "CDI says insurers and brokers must give a written copy of any replacement cost estimate they provide to an applicant who buys." : "",
      "Ask a local builder for current cost per square foot, or ask your insurer for its estimate in writing.",
      st === "CA" ? ["cdi401"] : []
    );
  }

  // 2. Actual cash value
  if (v.settlement === "acv") {
    add(
      "watch",
      "Actual cash value settlement",
      "Your policy pays actual cash value.",
      st === "TX"
        ? "TDI says actual cash value coverage pays replacement cost minus depreciation and costs less but pays less."
        : st === "CA"
          ? "CDI defines actual cash value for a structure loss as the lesser of the limit or fair market value, or repair cost less depreciation for a partial loss."
          : "Actual cash value pays replacement cost minus depreciation.",
      "Ask what replacement cost coverage would cost and whether any roof-specific settlement rules apply.",
      st === "TX" ? ["tdihome"] : st === "CA" ? ["cdi401"] : []
    );
  } else if (v.settlement === "unsure") {
    add("info", "Find out whether your policy pays replacement cost or actual cash value", "You were not sure.", "The difference can change what a claim pays.", "Look on your declarations page or ask your insurer.", guide);
  }

  // 3. Contents
  if (isNum(v.dwelling) && v.dwelling > 0 && isNum(v.contents)) {
    var pct = v.contents / v.dwelling;
    if (st === "CA" && (pct < 0.3 || pct > 0.7)) {
      add(
        "info",
        "Personal property limit compared with the usual guideline",
        "Your contents limit is " + Math.round(pct * 100) + "% of your dwelling limit.",
        "CDI says the contents limit is generally around 50% of the dwelling amount, but it is only a guideline; your own inventory is the reliable measure, and special limits apply to items like jewelry and firearms.",
        "Keep a home inventory and ask about scheduling high-value items.",
        ["cdi401"]
      );
    }
  }

  // 4. Liability vs assets; umbrella
  if (isNum(v.assets) && v.assets > 0 && isNum(v.liability) && v.liability > 0 && v.assets > v.liability && v.umbrella !== "yes") {
    add(
      "watch",
      "Home liability limit is lower than your assets and you have no umbrella",
      "Liability limit " + money(v.liability) + "; assets you want to protect " + money(v.assets) + ".",
      st === "TX" ? "TDI says home policy liability coverage is limited and a separate umbrella policy can add more." : "General consideration; umbrella policies add liability coverage above home and auto policies.",
      "Ask about a higher home liability limit or an umbrella. Umbrella insurers often require certain underlying limits.",
      st === "TX" ? ["tdihome"] : []
    );
  }

  // 5. Flood
  var flood = v.flood,
    zone = v.zone;
  if (flood !== "yes") {
    if (zone === "yes") {
      add(
        "gap",
        "In a high-risk flood zone without flood insurance",
        "You said your home is in a federally mapped high-risk flood zone and that you " + (flood === "no" ? "do not have" : "are not sure you have") + " flood insurance.",
        "Homeowners policies generally exclude flood. Lenders require flood insurance in federally mapped high-risk zones, and NFIP policies usually take effect 30 days after purchase.",
        "Confirm your zone on the FEMA map, ask your lender, and compare NFIP and private flood quotes.",
        st === "CA" ? ["cdi401", "cdiflood"] : st === "TX" ? ["tdihome", "tdiblog"] : []
      );
    } else {
      add(
        "watch",
        "No flood coverage",
        "You " + (flood === "no" ? "do not have" : "are not sure you have") + " flood insurance.",
        st === "CA"
          ? "CDI says standard homeowners policies do not cover flood and the FAIR Plan does not cover storm damage unless a difference-in-conditions policy is added."
          : st === "TX"
            ? "TDI says home insurance does not cover flood; a separate flood policy is needed."
            : "Homeowners policies exclude flood.",
        "Check your flood risk on the FEMA map. Flood damage often occurs outside mapped high-risk zones.",
        st === "CA" ? ["cdiflood"] : st === "TX" ? ["tdihome"] : []
      );
    }
  }

  // 6. California earthquake
  if (st === "CA") {
    if (v.quake !== "yes") {
      var ded = isNum(v.dwelling) ? " For example, a 15% earthquake deductible on your dwelling limit would be " + money(v.dwelling * 0.15) + "." : "";
      add(
        "watch",
        "No earthquake coverage",
        "You " + (v.quake === "no" ? "do not have" : "are not sure you have") + " earthquake insurance.",
        "California homeowners policies do not cover earthquake damage (except fire that follows). Insurers must offer it; CEA deductibles range from 5% to 25% of dwelling coverage." + ded,
        "Ask about CEA and other earthquake options and how the deductible would work for your home.",
        ["cdieq", "cea"]
      );
    } else if (isNum(v.dwelling)) {
      add(
        "info",
        "Earthquake deductible in dollars",
        "CEA deductibles are 5%, 10%, 15%, 20% or 25% of dwelling coverage. On your limit that is " + money(v.dwelling * 0.05) + " to " + money(v.dwelling * 0.25) + ".",
        "Earthquake deductibles are percentages, so they can be large.",
        "Check which percentage your policy uses and whether that amount is workable.",
        ["cea"]
      );
    }
  }

  // 7. Wind / hurricane deductible
  if ((st === "FL" || st === "TX") && isNum(v.windPct) && v.windPct > 0 && isNum(v.dwelling)) {
    var dollars = (v.dwelling * v.windPct) / 100;
    add(
      "info",
      (st === "FL" ? "Hurricane" : "Wind/hail") + " deductible in dollars",
      "A " + v.windPct + "% deductible on your dwelling limit is " + money(dollars) + " before the insurer pays for that loss.",
      st === "FL"
        ? "Florida insurers must offer $500, 2%, 5% and 10% hurricane deductibles; it is separate from the regular deductible and applies once per year with the same insurer group."
        : "Wind and hail deductibles are commonly a percentage of the dwelling limit (policy practice, not a statute).",
      "Confirm the percentage on your declarations page and think about whether you could cover that amount.",
      st === "FL" ? ["fl627", "fldfs"] : []
    );
  }

  // 8. Texas coast
  if (st === "TX" && v.twiaArea === "yes" && v.wind !== "yes") {
    add(
      "gap",
      "Coastal Texas home without confirmed wind and hail coverage",
      "You said your home is in the TWIA area and that you " + (v.wind === "no" ? "do not have" : "are not sure you have") + " wind and hail coverage.",
      "TDI says home policies on the Texas coast may not cover wind and hail; TWIA sells it. Once a named storm enters the Gulf, most insurers including TWIA stop selling new policies or making changes, and TWIA may require a flood policy or an inspection first.",
      "Ask your agent about wind and hail coverage now, not during storm season.",
      ["tdihome", "tdiblog", "twia"]
    );
  }

  // 9. State-backed plans
  if (v.pool && v.pool !== "none") {
    if (v.pool === "fair" && st === "CA") {
      add(
        "watch",
        "FAIR Plan policy: check what is missing",
        "You told us your home is insured through the California FAIR Plan.",
        "CDI says the FAIR Plan offers a standard fire policy for the structure and contents with limits, and no liability or coverage for other perils such as burglary. CDI suggests considering a difference-in-conditions or other supplemental policy from a private insurer.",
        "Ask an agent or broker which supplemental coverage fills the gaps, and whether private options exist for your area.",
        ["cdi401", "cdiflood"]
      );
    } else if (v.pool === "fair" && st === "TX") {
      add(
        "info",
        "Texas FAIR Plan policy",
        "You told us your home is insured through the Texas FAIR Plan.",
        "TDI says FAIR Plan coverage is for people that at least two companies have turned down. This tool has not verified what the Texas FAIR Plan covers.",
        "Read the policy and ask what is excluded.",
        ["tdihome"]
      );
    } else if (v.pool === "twia" && st === "TX") {
      add(
        "watch",
        "TWIA covers wind and hail only",
        "You told us you have TWIA coverage.",
        "TDI describes TWIA as wind and hail coverage for coastal residents. Other perils such as fire and theft, and flood, need other policies.",
        "Confirm you also have a home policy for other perils and a flood policy.",
        ["tdihome", "twia"]
      );
    } else if (v.pool === "citizens" && st === "FL") {
      var cites = ["citflood"];
      if (flood !== "yes" && isNum(v.dwelling) && v.dwelling >= 400000) {
        add(
          "gap",
          "Citizens policy with a $400,000+ dwelling limit and no flood coverage",
          "Your dwelling limit is " + money(v.dwelling) + " and you " + (flood === "no" ? "do not have" : "are not sure you have") + " flood insurance.",
          "Reported schedule: Citizens wind policies with $400,000+ dwelling replacement cost need flood coverage from January 1, 2026, and all remaining policies from January 1, 2027. This comes from secondary sources quoting Florida Statutes 627.351(6)(aa); confirm with Citizens.",
          "Check the flood requirement on Citizens' site and your renewal notice.",
          cites
        );
      } else if (flood !== "yes") {
        add(
          "watch",
          "Citizens flood requirement is expanding",
          "You told us your home is insured through Citizens and you do not have flood insurance.",
          "Reported schedule: all remaining Citizens wind policies must carry flood coverage from January 1, 2027 (secondary sources quoting the statute).",
          "Confirm the current rule with Citizens.",
          cites
        );
      }
      add(
        "info",
        "Citizens and private offers",
        "Citizens is Florida's last-resort insurer.",
        "Secondary sources report a private offer within 20% of the Citizens rate can make a home ineligible for Citizens.",
        "Get private quotes before renewal and confirm the rule with Citizens.",
        cites
      );
    }
  }

  // 10. Regular deductible vs dwelling
  if (isNum(v.deductible) && isNum(v.dwelling) && v.dwelling > 0 && v.deductible / v.dwelling > 0.05) {
    add(
      "info",
      "Deductible is more than 5% of the dwelling limit",
      "Deductible " + money(v.deductible) + " on a " + money(v.dwelling) + " dwelling limit (" + ((100 * v.deductible) / v.dwelling).toFixed(1) + "%).",
      "Larger deductibles lower premiums but raise what you pay first on a claim.",
      "Confirm you could cover this amount.",
      []
    );
  }
  return f;
}

export var HOME_QUESTIONS = {
  CA: [
    "How did you calculate my rebuild cost, and can I have the estimate in writing?",
    "Is building-code upgrade coverage included?",
    "Which Safer from Wildfires discounts apply to my home, what is my wildfire risk score, and how do I appeal it?",
    "What earthquake options are available and what would the deductible be?",
    "If I am on the FAIR Plan, which private supplemental policy fills the gaps?",
  ],
  TX: [
    "Is my policy replacement cost or actual cash value, including for my roof?",
    "What is my wind and hail deductible in dollars?",
    "Am I in the TWIA area and do I have wind and hail coverage?",
    "Do I need flood insurance, and how soon would a new policy take effect?",
  ],
  FL: [
    "What is my hurricane deductible in dollars, and can I lower it with mitigation credits?",
    "What wind mitigation credits am I receiving?",
    "Do I have flood coverage, and does my policy or lender require it?",
    "If I am with Citizens, have I compared private offers and met the flood requirement?",
  ],
};
