// All site content lives here. Edit this file to update the portfolio.
window.PROFILE = {
  name: "Gautam Pandey",
  role: "Software Engineer · Backend & Full-Stack",
  location: "Delhi NCR, India",
  careerStart: "2024-06-01",
  email: "gautampandey961@gmail.com",
  phone: "+91 83758 54251",
  phoneRaw: "+918375854251",
  resume: "assets/Gautam_Pandey_Resume.pdf",
  links: {
    github: "https://github.com/gautam1503",
    linkedin: "https://www.linkedin.com/in/gautam-p-a0a317213/",
    // TODO: replace with your LeetCode profile URL
    leetcode: "https://leetcode.com/"
  },

  // Personal projects are loaded live from GitHub: new repos appear and deleted ones disappear automatically.
  github: {
    user: "gautam1503",
    // Repo names to never show (company take-home assessments are hidden for now)
    hide: [
      "portfolio",
      "luckpay-assessment", "BAJAJ_TEST", "Zippee-Assignment", "Zettabola-Assessment",
      "reno-assignment", "WB-Assignment", "eta-assignment", "Scaler_Assignment"
    ],
    showForks: false
  },

  rotatingRoles: [
    "distributed microservices",
    "high-throughput REST APIs",
    "event-driven systems",
    "full-stack web products",
    "AI-powered automation",
    "secure third-party integrations"
  ],

  summary:
    "I'm a software engineer who owns features end to end, from schema design and APIs to queues, caching, deployment and the React screen the user actually clicks. I've shipped production systems in payments, healthcare and the open web. The domain changes; the engineering doesn't: correctness under concurrency, resilient async workflows, clean APIs and measurable performance.",

  highlights: [
    "End-to-end ownership of production microservices",
    "Polyglot: Java, Python, Go, JavaScript / TypeScript",
    "AI & LLM integrations and automation pipelines",
    "SQL + NoSQL, caching and message queues",
    "Freelance web work: fixes, rescues and launches"
  ],

  domains: ["Digital Rupee (e₹) / CBDC", "Payments & Banking APIs", "Healthcare SaaS", "E-commerce & CMS sites", "Internal Tools & Dashboards", "Identity & Verification"],

  stats: [
    { value: 10000, suffix: "+", label: "API requests served daily" },
    { value: 1.5, prefix: "$", suffix: "M+", decimals: 1, label: "Transaction volume processed" },
    { value: 45, suffix: "%", label: "Lower cross-service latency" },
    { value: 80, suffix: "%", label: "Faster onboarding turnaround" }
  ],

  skills: [
    { group: "Languages", icon: "code", items: ["Java", "Python", "Go", "JavaScript", "TypeScript", "C++", "SQL"] },
    { group: "Backend & Frameworks", icon: "server", items: ["Spring Boot", "Spring Data JPA", "Hibernate", "JWT / HMAC security", "Node.js", "Express.js", "Django / DRF", "REST APIs", "Microservices"] },
    { group: "Frontend", icon: "layout", items: ["React.js", "HTML5", "CSS3", "Responsive UI", "Dashboards", "PDF / Excel exports"] },
    { group: "Databases", icon: "database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Query optimisation", "Row-level locking"] },
    { group: "Messaging & Async", icon: "zap", items: ["Apache Kafka", "AWS SQS", "Event-driven design", "Idempotency", "Retries & timeouts", "Redis Lua scripts"] },
    { group: "AI & Automation", icon: "spark", items: ["LLM API integration", "Prompt engineering", "AI content pipelines", "Python automation", "AI-assisted development"] },
    { group: "Cloud & DevOps", icon: "cloud", items: ["AWS (EC2, S3, SQS, RDS)", "Docker", "CI/CD", "Git", "Maven", "Logging & monitoring"] },
    { group: "Web Platforms", icon: "globe", items: ["WordPress", "Elementor", "Wix", "Other site builders", "Plugin & theme fixes"] },
    { group: "Practices & Tools", icon: "tool", items: ["DSA", "OOP & design patterns", "System design", "Postman", "Swagger / OpenAPI", "IntelliJ / VS Code"] }
  ],

  experience: [
    {
      company: "Cotopay",
      title: "Software Development Engineer II (SDE-2)",
      period: "Oct 2026 – Present",
      location: "Delhi NCR, India",
      stack: ["Java", "Spring Boot", "Spring Data", "Hibernate", "PostgreSQL", "AWS S3", "JWT", "HMAC", "Microservices", "Maven"],
      points: [
        "Developing backend services for the <b>Digital Rupee (e₹)</b> platform, extending corporate banking capabilities.",
        "Implemented wallet management and <b>UTR verification</b> workflows that improve payment accuracy and prevent duplicate credits.",
        "Built secure transaction authorization APIs: <b>PIN management</b>, <b>OTP-based recovery</b> and account lockout mechanisms.",
        "Developed <b>asynchronous bulk transaction processing</b> using <b>AWS S3</b> with data validation.",
        "Integrated Calendly webhooks with <b>HMAC signature verification</b> and idempotency checks for reliable lead tracking.",
        "Work with cross-functional teams to define API contracts, validate end-to-end workflows and keep backend operations reliable."
      ]
    },
    {
      company: "Luckpay Solutions",
      title: "Software Developer — Backend / API Platform",
      period: "Nov 2025 – Oct 2026",
      location: "Delhi NCR, India",
      stack: ["Java", "Spring Boot", "Kafka", "AWS SQS", "Redis", "MySQL", "Docker", "AWS"],
      points: [
        "Own the full backend lifecycle of an API platform (merchant onboarding, verification APIs and wallet management) serving <b>10,000+ requests/day</b> and <b>$1.5M+</b> in transaction volume.",
        "Decoupled synchronous service calls into <b>Kafka</b> streams and <b>SQS</b> queues with strict timeouts, retries and idempotency, cutting cross-service latency by <b>45%</b>.",
        "Built high-concurrency wallet engines with pre-transaction balance validation, explicit state machines (REQUESTED → SUCCESS / FAILED) and row-level DB locking, so balances never drift.",
        "Integrated 6+ payment gateways (Cashfree, Razorpay, PayU, Easebuzz, PhonePe, JioPay, Decentro), recurring mandates (eNACH, UPI AutoPay) and cross-border rails (Tazapay, GlomoPay).",
        "Integrated multi-provider identity APIs (PAN, GSTIN, penny drop, IFSC, OTP/SMS, WhatsApp, VKYC, Account Aggregator, Experian) with end-to-end payload encryption and audit trails, cutting onboarding time by <b>80%</b>.",
        "Containerised services with Docker on AWS (EC2, SQS, RDS) and set up centralised logging and UAT/prod monitoring, raising release velocity by <b>30%</b>."
      ]
    },
    {
      company: "Doxper (Meddo)",
      title: "Associate Software Developer — Full-Stack",
      period: "Jun 2024 – Oct 2025",
      location: "Gurugram, India",
      stack: ["React.js", "Python", "Django", "PostgreSQL", "Redis"],
      points: [
        "Built responsive <b>React.js</b> modules (Patient Dashboard, Doctor Profile, Appointment Management, Report History) on <b>Python/Django REST</b> APIs used by <b>500+ daily active doctors</b>.",
        "Fixed stale Redis cache-invalidation bugs and tuned complex PostgreSQL queries, cutting database load times by <b>35%</b> and keeping the app stable at peak hours.",
        "Shipped an automated medical-report engine (upload, auto-categorise, retrieve) with dynamic A4 PDF and Excel exports, removing manual document work for clinical teams."
      ]
    },
    {
      company: "Freelance",
      title: "Full-Stack & Web Developer",
      period: "Ongoing",
      location: "Remote",
      stack: ["MERN", "WordPress", "Elementor", "Wix", "PHP", "SQL"],
      points: [
        "Delivered multiple client projects: UI fixes, broken layouts, responsive and cross-browser issues across React and plain HTML/CSS sites.",
        "Debugged and fixed backend issues: failing APIs, auth bugs, slow queries and broken form and email flows.",
        "Fixed and customised sites built on <b>WordPress, Elementor, Wix</b> and other builders: theme/plugin conflicts, page-builder layout bugs, speed and SEO basics."
      ]
    }
  ],

  projects: [
    {
      title: "Digital Rupee (e₹) Corporate Banking Services",
      category: "backend",
      tagline: "Secure backend for corporate payments on India's CBDC",
      stack: ["Java", "Spring Boot", "Hibernate", "PostgreSQL", "AWS S3", "JWT"],
      points: [
        "Wallet management and UTR verification that prevent duplicate credits.",
        "Transaction authorization with PIN management, OTP-based recovery and account lockout.",
        "Asynchronous bulk transaction processing from AWS S3 uploads with data validation."
      ]
    },
    {
      title: "Secure Webhook Ingestion",
      category: "integrations",
      tagline: "Reliable, verified event intake from third-party platforms",
      stack: ["Java", "Spring Boot", "HMAC", "PostgreSQL"],
      points: [
        "Calendly webhooks verified with HMAC signatures so forged events are rejected.",
        "Idempotency checks make retried deliveries safe, giving reliable lead tracking."
      ]
    },
    {
      title: "Real-Time Fee Reservation Engine",
      category: "backend",
      tagline: "Blocked-balance system that stopped revenue leakage on paid APIs",
      stack: ["Java", "Spring Boot", "Redis Lua", "Kafka / SQS", "MySQL"],
      points: [
        "Atomic Redis Lua scripts reserve and release fees: thread-safe and idempotent under concurrent calls, with no race-condition overspend.",
        "Dual-key Redis schema with TTL safety nets and a retry scheduler that recovers automatically when downstream services are down.",
        "Cross-service pricing-plan cache (dashboard → Redis → API service) resolves per-API fees at request time."
      ]
    },
    {
      title: "Payment Gateway & Payment Links",
      category: "backend",
      tagline: "Redirect-flow pay-in platform built from scratch",
      stack: ["Java", "Spring Boot", "Microservices", "6+ PSP APIs"],
      points: [
        "Pay-in platform with merchant-service and IP-whitelist validation, plus a merchant-facing Payment Links feature.",
        "Unified integration layer over Cashfree, Razorpay, PayU, Easebuzz, PhonePe, JioPay and Decentro for payments, QR and transaction management.",
        "Recurring mandates (eNACH, UPI AutoPay) and cross-border payouts via Tazapay and GlomoPay."
      ]
    },
    {
      title: "Event-Driven Wallet Adjustment System",
      category: "backend",
      tagline: "Safe manual credit/debit tooling for operations teams",
      stack: ["Java", "Spring Boot", "AWS SQS", "MySQL", "Event-Driven"],
      points: [
        "SQS-based flow for corrections, reversals and approved fee adjustments, with OTP verification, duplicate-request checks and full audit logging.",
        "Every balance mutation goes through a single owning service, which keeps row-level locking, ledger entries and idempotency intact.",
        "Completion events move request status from REQUESTED to SUCCESS / FAILED."
      ]
    },
    {
      title: "Generic URL Shortener Service",
      category: "backend",
      tagline: "Shared short-link service used across microservices",
      stack: ["Java", "Spring Boot", "Redis", "REST"],
      points: [
        "One reusable service that any microservice calls to send short, trackable links to users.",
        "Short links send users back into their in-progress flow, including video-KYC journeys."
      ]
    },
    {
      title: "Consent-Based Data Integrations",
      category: "integrations",
      tagline: "End-to-end consent flows over complex third-party APIs",
      stack: ["Java", "Encryption", "OAuth / Tokens", "Webhooks"],
      points: [
        "Integrated Video-KYC, credit analytics, Experian and Account Aggregator APIs.",
        "Designed the full consent journey (request, approve, fetch, audit) with encrypted payloads and token auth."
      ]
    },
    {
      title: "Healthcare Practice Platform",
      category: "fullstack",
      tagline: "Doctor & patient modules for a clinical SaaS product",
      stack: ["React.js", "Django REST", "PostgreSQL", "Redis"],
      points: [
        "Patient dashboard, doctor profiles, appointments and report history for 500+ daily active doctors.",
        "Medical-report engine with auto-categorisation and A4 PDF / Excel exports."
      ]
    },
    {
      title: "Client Website Rescues",
      category: "freelance",
      tagline: "Fixing what's broken on live business websites",
      stack: ["WordPress", "Elementor", "Wix", "CSS", "PHP"],
      points: [
        "Resolved plugin/theme conflicts, broken Elementor layouts and mobile responsiveness issues.",
        "Speed, form, email-delivery and basic SEO fixes on production sites with zero downtime."
      ]
    },
    {
      title: "MERN Feature & Bug-Fix Work",
      category: "freelance",
      tagline: "UI polish and backend fixes for client apps",
      stack: ["MongoDB", "Express", "React", "Node.js"],
      points: [
        "Fixed UI bugs and built new React components and screens to match client designs.",
        "Debugged Express/Node APIs, auth flows and database queries in existing codebases."
      ]
    }
  ],

  freelanceServices: [
    { icon: "layout", title: "UI & Frontend Fixes", text: "Broken layouts, responsive issues, cross-browser bugs and pixel-perfect implementation in React or plain HTML/CSS." },
    { icon: "server", title: "Backend & API Fixes", text: "Failing endpoints, auth problems, slow queries, integrations and deployment issues in Node, Python, Java or Go." },
    { icon: "globe", title: "WordPress · Elementor · Wix", text: "Theme and plugin conflicts, page-builder bugs, speed, forms and SEO basics on no-code and CMS sites." },
    { icon: "rocket", title: "Build From Scratch", text: "Full-stack MERN or Django apps, from database design to deployment on AWS with Docker." }
  ],

  principles: [
    { title: "Correct under load", text: "Idempotency keys, atomic operations, locking and state machines, so concurrent traffic never corrupts data." },
    { title: "Resilient by design", text: "Async queues, timeouts, retries and TTL safety nets, so one slow dependency doesn't take the system down." },
    { title: "Measured, not guessed", text: "Logging, monitoring and query profiling before optimising, with impact reported in numbers." },
    { title: "Own it end to end", text: "Requirements to schema to API to UI to production, then on-call for what I ship." }
  ],

  awards: [
    { title: "Rising Star Award", org: "Recognised for outstanding impact and ownership", text: "Awarded for rapid growth, delivering critical production features and taking ownership beyond my role." },
    { title: "CGPA 9.3 / 10", org: "Chitkara University", text: "Graduated with distinction in Computer Science & Engineering." }
  ],

  education: {
    degree: "Bachelor of Engineering — Computer Science & Engineering",
    school: "Chitkara University, Baddi, HP",
    score: "CGPA 9.3 / 10"
  }
};
