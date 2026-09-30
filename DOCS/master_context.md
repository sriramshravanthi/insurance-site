# INSURANCE COMPARISON & SAVINGS PLATFORM

## MASTER CONTEXT FOR CLAUDE CODE

## 1. PROJECT OBJECTIVE

Build a professional U.S.-focused insurance comparison and education website that helps consumers understand, compare, evaluate, and potentially reduce the cost of:

1. Auto / Car Insurance
2. Homeowners Insurance

The website should act like an intelligent insurance-shopping assistant.

The goal is NOT simply to show the cheapest insurance company.

The website should explain:

* Why different insurance companies quote different prices for the same person and vehicle/home
* Why one company may be cheaper while another is more expensive
* What factors influence insurance premiums
* What coverage the customer is actually purchasing
* What discounts may be available
* Whether the customer may be paying more than necessary
* What information affects the quote
* What questions a consumer should ask before purchasing
* How deductibles, limits, coverage types, risk factors, location, claims history, driving history, property characteristics, and other factors affect price
* How policy terms such as 6-month and 12-month policies work
* How consumers can compare policies based on BOTH price and coverage

The website should educate first and help users make informed insurance-shopping decisions.

---

# 2. TARGET USERS

Primary users:

### Auto Insurance

* First-time insurance buyers
* Young drivers
* Experienced drivers
* Older drivers
* Families with multiple vehicles
* Drivers with clean driving records
* Drivers with accidents
* Drivers with tickets/violations
* Drivers with previous claims
* Drivers purchasing a new car
* Drivers replacing an existing policy
* Drivers looking for cheaper premiums
* Drivers who want better coverage
* Drivers who do not understand insurance terminology

### Home Insurance

* First-time homeowners
* Existing homeowners
* Homeowners renewing their policy
* Homeowners who believe they are paying too much
* Homeowners comparing insurance companies
* Homeowners who recently purchased a property
* Homeowners with prior claims
* Homeowners looking for discounts
* Homeowners who want to understand coverage gaps

---

# 3. CORE WEBSITE CONCEPT

Create a website where a consumer can enter relevant information and receive an understandable insurance analysis.

Example:

USER:
"I have a 2022 Honda Accord, age 35, clean driving record, living in California, and currently pay $2,400/year."

The system should analyze the information and explain:

* What factors may influence this premium
* What types of insurers may price this risk differently
* Which discounts may potentially apply
* Whether the current premium appears high/low relative to available comparison data, where reliable data is available
* What coverage differences must be checked before comparing prices
* What questions the user should ask insurers
* Potential savings opportunities
* What information could change the quote
* What the user should NOT assume simply because another company quotes less

Do NOT make unsupported claims that a particular insurer is always cheaper or better.

Insurance pricing changes by:

* State
* ZIP/location
* Driver
* Vehicle
* Property
* Coverage
* Claims
* Underwriting rules
* Discounts
* Market conditions
* Policy characteristics

Therefore, the system must clearly distinguish between:

1. Educational information
2. Estimated analysis
3. Actual insurer quotes
4. User-provided information
5. Third-party/reference data

---

# 4. AUTO INSURANCE MODULE

Create a dedicated Auto Insurance section.

## Auto Insurance Input Information

Allow users to provide information such as:

### Driver Information

* Age
* State
* ZIP code
* Driving experience
* Marital status where legally relevant
* Number of drivers
* Young drivers in household
* Driver history
* Tickets
* Accidents
* Claims
* DUI/DWI where legally relevant
* Years without an accident
* Insurance history
* Continuous coverage history

Do not collect or use information that is prohibited from being used for insurance pricing in a particular jurisdiction.

The system must be designed so state-specific rules can be incorporated.

### Vehicle Information

* Year
* Make
* Model
* Trim
* Vehicle type
* VIN where appropriate
* Purchase/lease/finance status
* Vehicle value
* Safety features
* Anti-theft/security features
* Driver assistance technology
* Repair costs
* Replacement cost
* Mileage
* Annual mileage
* Primary use
* Commute distance
* Business use
* Parking location
* Garage/carport/street parking

### Coverage Information

Allow users to enter current or desired:

* Liability coverage
* Bodily injury liability
* Property damage liability
* Collision
* Comprehensive
* Uninsured motorist
* Underinsured motorist
* Medical payments/PIP where applicable
* Rental reimbursement
* Roadside assistance
* Gap coverage
* Custom equipment coverage
* Other applicable coverages

### Current Policy Information

* Current insurance company
* Current premium
* Monthly premium
* Six-month premium
* Annual premium
* Deductible
* Coverage limits
* Discounts
* Renewal date
* Policy term

---

# 5. WHY AUTO INSURANCE PRICES DIFFER

The website must have an educational section explaining:

"Why are two insurance companies charging different prices for the same driver and the same car?"

Explain that insurance companies have different:

* Underwriting models
* Risk models
* Claims experience
* Loss ratios
* Pricing strategies
* Reinsurance costs
* Operating expenses
* Distribution costs
* Customer acquisition costs
* Target customer segments
* Geographic exposure
* Repair-cost assumptions
* Fraud assumptions
* Catastrophe exposure
* Discounts
* Rating factors
* State-specific filings and regulatory constraints

A company may intentionally price a particular risk lower or higher because that risk fits differently into its business model.

Example:

Company A may have strong pricing for drivers with clean records.

Company B may have a different pricing model and may be more competitive for another customer profile.

Therefore:

"Cheaper" does NOT automatically mean "better."

"More expensive" does NOT automatically mean "better coverage."

The system should compare:
PRICE + COVERAGE + DEDUCTIBLE + LIMITS + EXCLUSIONS + DISCOUNTS + CUSTOMER REQUIREMENTS.

---

# 6. WHY SOME COMPANIES ARE CHEAPER

Create an educational explanation covering potential reasons such as:

* Different underwriting models
* Lower operating costs
* Direct-to-consumer sales
* Lower agent/distribution costs
* Different customer risk profile
* Different claims experience
* Different geographic exposure
* Different discounts
* Bundling
* Telematics programs
* Usage-based insurance
* Higher deductibles
* Different coverage limits
* Different policy structures
* Promotional/new-customer pricing
* Different risk appetite

Do not claim that every low-cost insurer uses these factors.

Explain them as possible reasons.

---

# 7. WHY SOME COMPANIES ARE MORE EXPENSIVE

Explain that higher premiums may result from:

* Different underwriting assumptions
* Higher claims costs
* Higher repair costs
* Higher catastrophe exposure
* Higher liability exposure
* Different coverage levels
* Lower deductibles
* Additional optional coverage
* Different customer-service/distribution model
* Different geographic pricing
* Different risk appetite
* Fewer applicable discounts
* Different loss experience

Again, explain these as possible factors rather than universal explanations.

---

# 8. DRIVER AGE ANALYSIS

Explain how age can affect insurance pricing where legally permitted.

Create educational examples for:

* Teen/young driver
* Young adult
* Middle-aged driver
* Older driver

Explain that age is only one potential factor and that actual pricing depends on state law, insurer rules, driving history, vehicle, coverage, and other rating factors.

---

# 9. DRIVER HISTORY ANALYSIS

Explain the potential impact of:

* Clean record
* Speeding ticket
* Multiple tickets
* At-fault accident
* Multiple accidents
* Comprehensive claim
* Collision claim
* DUI/DWI
* Prior insurance lapse

Explain that insurers may treat these situations differently.

Do not guarantee a specific premium increase or decrease.

---

# 10. VEHICLE ANALYSIS

Explain why two vehicles owned by the same person can have very different premiums.

Consider:

* Vehicle value
* Repair costs
* Parts availability
* Theft frequency
* Safety rating
* Safety equipment
* Accident frequency
* Performance
* Engine characteristics
* Vehicle size/type
* Claims history
* Replacement cost
* ADAS technology
* Specialized parts
* Luxury vehicle characteristics

Example:

Two vehicles may have similar purchase prices but significantly different insurance costs because insurers may have different claims and repair experience for those vehicles.

---

# 11. LOCATION ANALYSIS

Location is an important part of the comparison.

Allow analysis based on:

* State
* ZIP code
* Urban/suburban/rural area
* Traffic exposure
* Accident frequency
* Vehicle theft
* Weather risks
* Natural disasters
* Claims frequency
* Repair costs
* Litigation environment
* Local insurance regulations

For every location-based result, clearly identify that insurance rules and pricing vary by state.

Do not assume that a discount or rating factor is available in every state.

---

# 12. INSURANCE DISCOUNTS

Create a discount discovery engine.

Potential categories:

### Driver Discounts

* Safe driver
* Defensive driving
* Good student
* Mature driver where applicable
* Low-mileage

### Vehicle Discounts

* Anti-theft
* Safety equipment
* Driver-assistance technology
* New vehicle
* Alternative-fuel vehicle where applicable

### Policy Discounts

* Multi-policy
* Multi-vehicle
* Automatic payment
* Paperless
* Loyalty where applicable
* Pay-in-full where applicable

### Usage-Based

* Telematics
* Safe-driving programs
* Mileage-based programs

Important:

The system must display:

"Discount availability varies by insurer and state."

Do not assume a discount is available merely because it exists somewhere.

---

# 13. POLICY TERM ANALYSIS

Explain:

* 6-month policy
* 12-month policy
* Other policy arrangements where applicable

Explain:

* Premium amount
* Renewal
* Mid-term changes
* Rate changes
* Billing options
* Cancellation
* Renewal shopping

Allow the user to compare:

MONTHLY COST
vs.
6-MONTH COST
vs.
ANNUAL COST

Also explain that monthly payment does not necessarily mean the policy itself is monthly.

---

# 14. AUTO INSURANCE COMPARISON ENGINE

Build a comparison interface.

Example columns:

| Company | Estimated/Quoted Price | Coverage | Deductible | Discounts | Policy Term | Key Factors |
| Company A | $X | ... | ... | ... | 6 months | ... |
| Company B | $X | ... | ... | ... | 12 months | ... |
| Company C | $X | ... | ... | ... | ... | ... |

Clearly label whether the number is:

* Actual quote
* User-entered price
* Estimate
* Reference/market data

Never present an estimate as an actual insurer quote.

---

# 15. HOME INSURANCE MODULE

Create a dedicated Home Insurance section.

Allow users to enter:

## Property Information

* State
* ZIP code
* Property address when appropriate and securely handled
* Home type
* Single-family
* Condo
* Townhome
* Manufactured home where applicable
* Year built
* Square footage
* Number of floors
* Bedrooms
* Bathrooms
* Garage
* Basement
* Roof age
* Roof material
* Exterior construction
* Foundation
* HVAC
* Plumbing
* Electrical system
* Renovations
* Replacement cost
* Estimated property value
* Personal property value
* Home security systems
* Fire alarms
* Sprinkler systems
* Smart-home security
* Pool
* Trampoline
* Other risk features

---

# 16. HOME INSURANCE COVERAGE

Explain:

* Dwelling coverage
* Other structures
* Personal property
* Loss of use
* Personal liability
* Medical payments
* Deductibles
* Additional endorsements
* Replacement cost
* Actual cash value
* Water-related coverage
* Flood insurance
* Earthquake insurance
* Umbrella insurance where relevant

Clearly explain that homeowners insurance generally does not automatically cover every type of disaster.

Special coverage may be required depending on location and risk.

---

# 17. HOME INSURANCE PRICE ANALYSIS

Explain why two homeowners with similar houses may receive different premiums.

Potential factors:

* Location
* Home replacement cost
* Construction type
* Age of home
* Roof age
* Roof condition
* Claims history
* Deductible
* Coverage limits
* Property characteristics
* Disaster exposure
* Wildfire risk
* Hurricane risk
* Tornado risk
* Hail exposure
* Flood exposure
* Theft risk
* Security systems
* Insurance history
* Bundling
* Discounts
* Insurer underwriting model

---

# 18. "AM I PAYING TOO MUCH?" HOME ANALYSIS

Create a feature called:

## "Am I Paying Too Much?"

User enters:

* Current annual premium
* Coverage limits
* Deductible
* Property information
* Location
* Claims history
* Discounts
* Current insurer

The system analyzes the information.

Output should include:

### Current Situation

"Your current annual premium is $X."

### Coverage Check

"Your current deductible is X."

### Potential Savings Opportunities

Potential areas to investigate:

* Missing discounts
* Bundling
* Higher deductible
* Security improvements
* Updated roof
* Updated electrical/plumbing
* Shopping other insurers
* Correcting outdated property information
* Reviewing unnecessary coverage
* Comparing replacement-cost assumptions

### Important Warning

Never recommend reducing coverage simply to obtain a lower premium without explaining the potential financial risk.

---

# 19. SAVINGS CALCULATOR

Create a savings calculator.

Example:

Current premium:
$2,400/year

Potential alternative:
$1,900/year

Potential difference:
$500/year

Monthly equivalent:
$41.67/month

However, the system must also compare:

* Coverage limits
* Deductibles
* Exclusions
* Endorsements
* Policy term

A lower premium should only be described as a potential saving when the comparison is sufficiently equivalent.

Use language such as:

"Potential premium difference"

rather than guaranteeing savings.

---

# 20. INSURANCE COMPANY DATABASE

Create a scalable structure for U.S. insurance companies.

Potential fields:

* Company name
* Parent company
* Insurance products
* States served
* Auto insurance
* Home insurance
* Other insurance
* Available discounts
* Policy options
* Distribution method
* Agent/direct/online
* Official website
* State availability
* Licensing information where available
* Data source
* Last updated date

Do not hard-code claims such as:

"Company X is always cheapest."

Pricing must be treated as dynamic.

---

# 21. BUSINESS MODEL

The website itself can support multiple business models.

Potential models:

### 1. Lead Generation

Insurance shoppers submit information and may be connected with licensed agents/carriers.

### 2. Referral Partnerships

Potential referral relationships with insurance providers or licensed agencies.

### 3. Advertising

Clearly labeled insurance-related advertising.

### 4. Premium Comparison / Affiliate Model

Where legally and contractually permitted.

### 5. Educational Content

Insurance education, guides, calculators, and comparison tools.

### 6. B2B / Insurance Analytics

Potential future services for agencies, brokers, or businesses.

The website must clearly disclose any commercial relationship that could influence results.

---

# 22. IMPORTANT REGULATORY / COMPLIANCE DESIGN

This is a U.S. insurance website.

The application must be designed with compliance in mind.

Do not represent the website as an insurance company unless it actually is one.

Do not represent the website as a licensed insurance agent or broker unless properly licensed.

Do not provide legally binding insurance quotes unless the appropriate licensed/authorized infrastructure is actually connected.

Clearly distinguish:

* Educational information
* Estimates
* Advertiser information
* Referral results
* Actual carrier quotes

Consider state-by-state requirements for:

* Insurance advertising
* Licensing
* Producer/broker activities
* Lead generation
* Disclosures
* Privacy
* Data security
* Consumer consent
* Marketing communications

The website should contain appropriate disclaimers and privacy disclosures.

Do not create fake insurance quotes or imply a carrier approved a quote when it did not.

---

# 23. USER JOURNEY

Create a simple consumer journey.

### STEP 1

Choose:

[ AUTO INSURANCE ]

or

[ HOME INSURANCE ]

### STEP 2

Answer questions.

### STEP 3

Analyze risk and coverage information.

### STEP 4

Identify applicable comparison factors.

### STEP 5

Show potential insurers/options where reliable data or connected quote sources are available.

### STEP 6

Explain why prices may differ.

### STEP 7

Identify potential discounts.

### STEP 8

Identify potential savings opportunities.

### STEP 9

Compare coverage.

### STEP 10

Allow the user to continue shopping or contact an appropriate licensed provider where applicable.

---

# 24. INTELLIGENT EXPLANATION ENGINE

Every result should answer:

### WHAT?

What is the insurance option?

### WHY?

Why might this company/product be priced this way?

### HOW?

How was the result determined?

### WHAT CHANGES THE PRICE?

Which factors could increase or decrease the premium?

### WHAT SHOULD I CHECK?

What should the consumer verify before buying?

### WHAT COULD I SAVE?

What potential savings opportunities exist?

### WHAT IS THE RISK?

What could the customer lose by choosing lower coverage?

This should make the website educational rather than just a price-comparison page.

---

# 25. EXAMPLE AUTO USE CASE

User:

Age: 35
State: California
ZIP: XXXXX
Vehicle: 2022 Honda Accord
Driving history: Clean
Annual mileage: 12,000
Current premium: $2,400
Deductible: $500

The system should NOT simply say:

"Company A is cheaper."

Instead:

"Your current premium is $2,400/year. Several factors can influence your premium, including location, driving history, vehicle characteristics, coverage limits, deductible, annual mileage, and insurer-specific underwriting."

Then show:

Potential comparison factors:

* Clean driving history
* Vehicle safety/security features
* Mileage
* Available discounts
* Deductible
* Coverage limits
* Location

Then:

"Potential savings opportunities to investigate"

and explain the reasons.

---

# 26. EXAMPLE HOME USE CASE

User:

Location: California
Home value: $800,000
Home size: 2,000 sq ft
Year built: 2005
Roof: 5 years old
Security system: Yes
Claims: None
Current premium: $3,000/year

System analyzes:

* Property characteristics
* Location risks
* Current coverage
* Deductible
* Claims history
* Security features
* Roof age
* Discounts
* Bundling possibilities
* Other insurers/options where data is available

Then display:

"Potential areas to investigate"

rather than guaranteeing:

"You will save $X."

---

# 27. WEBSITE PAGES

Create a professional navigation structure.

Suggested primary navigation:

* Home
* Auto Insurance
* Home Insurance
* Compare
* Savings
* Learn
* Insurance Companies
* Tools
* About

Potential mega-menu structure:

### Auto Insurance

* Compare Auto Insurance
* How Auto Insurance Works
* Factors Affecting Price
* Discounts
* Coverage Types
* Young Drivers
* Accidents & Tickets
* Vehicle Factors
* State-by-State Guide

### Home Insurance

* Compare Home Insurance
* How Home Insurance Works
* Coverage Types
* Home Factors
* Discounts
* Claims
* Deductibles
* Disaster Risks
* State-by-State Guide

### Learn

* Insurance Basics
* Insurance Terms
* Buying Guide
* Renewal Guide
* Claims Guide
* Saving Money
* Questions to Ask an Insurer

### Tools

* Auto Insurance Savings Calculator
* Home Insurance Savings Calculator
* Coverage Comparison
* Deductible Calculator
* Insurance Checklist

---

# 28. DESIGN REQUIREMENTS

The website should look like a trustworthy modern U.S. financial/insurance technology platform.

Design principles:

* Professional
* Clean
* Trustworthy
* Easy for first-time users
* Mobile responsive
* Accessible
* Fast
* Data-focused
* Clear typography
* Simple forms
* Strong comparison tables
* Interactive calculators
* Clear explanations
* Avoid clutter
* Avoid aggressive sales language

Use visual indicators for:

* Price
* Potential savings
* Coverage
* Deductible
* Discounts
* Risk factors
* Missing information

Do NOT use misleading "BEST COMPANY" labels unless backed by a clearly defined, transparent methodology.

Prefer neutral labels such as:

* Lower displayed premium
* Higher displayed premium
* More coverage
* Lower deductible
* Potential discount
* Requires verification
* Not available in this state

---

# 29. DATA ARCHITECTURE

Design the application so data can later be connected to:

* Insurance company APIs
* Quote providers
* Public regulatory data
* State insurance departments
* Insurance company websites
* Licensed agents
* Third-party insurance data providers
* User-provided information

Never assume that web-scraped prices are real-time quotes.

Every data record should ideally contain:

* Source
* Date collected
* Geographic scope
* Data type
* Confidence/verification status
* Last updated date

---

# 30. AI/ML FUTURE CAPABILITIES

Design the architecture so AI capabilities can later be added.

Potential capabilities:

### Insurance Explanation AI

Explain insurance terminology in simple language.

### Quote Comparison AI

Compare policy information.

### Savings Opportunity AI

Identify possible savings opportunities.

### Coverage Gap AI

Identify potential areas the consumer should discuss with a licensed professional.

### Personalized Question Generator

Generate questions the consumer should ask insurers.

### Renewal Analyzer

Analyze a renewal notice against the previous policy.

### Policy Document Analyzer

Allow users to upload a policy and identify:

* Premium
* Deductible
* Coverage limits
* Major exclusions
* Endorsements
* Changes from previ

<!-- NOTE: the text supplied ended here, mid-sentence, in section 30. If you have the complete original, replace this file with it. -->
