// This file contains all missing translation keys found in the components
// Organized by component for easy integration

export const missingTranslations = {
  // Hero.jsx
  hero: {
    badge: "Save 96% of your editing time",
    titleLine1: "Stop wasting hours",
    titleLine2: "trimming silence.",
    images: {
      rawFootage: "Raw footage with silences",
      processing: "Trimly processing",
      cleanTimeline: "Clean XML timeline",
    },
  },

  // Download.jsx  
  download: {
    title: "Download AutoTrim",
    subtitle: "Free to try. Process your files and preview your cuts. Pay only when you're ready to export.",
    chooseOS: "Choose your OS",
    macOS: "Download for macOS",
    windows: "Download for Windows",
    otherPlatform: "Other platform:",
    githubNote: "All downloads are served from the latest GitHub release.",
    buttons: {
      macOS: "macOS",
      windows: "Windows",
    },
  },

  // WhyAutoTrim.jsx
  whyAutoTrim: {
    title: "Why AutoTrim?",
    features: {
      saveHours: {
        title: "Save Hours Every Week",
        description: "Stop wasting time manually trimming silences, filler words and awkward pauses.",
        subtitle: "AutoTrim cuts your raw footage in seconds.",
      },
      oneTimeline: {
        title: "One Clean Timeline",
        description: "No puzzle to reassemble. Export one polished XML timeline directly to your editor.",
        subtitle: "All clips on one timeline, ready to go.",
      },
      fastPrivate: {
        title: "Super Fast, Private, Local",
        description: "No cloud processing. Everything runs offline, on your machine.",
        subtitle: "Secure, private and blazing fast.",
      },
    },
  },

  // SocialProof.jsx
  socialProof: {
    stats: {
      faster: "≈ 29× faster",
      timeSaved: "Save ~46 min of work on 30 min of footage",
      localPrivate: "100% local & private",
    },
  },

  // TimeComparison.jsx
  timeComparison: {
    badges: {
      timeSaved: {
        title: "Time Saved",
        description: "On average, editors save 46 minutes per 30-minute raw video",
      },
      fasterThanManual: {
        title: "Faster Than Manual Editing",
        description: "AutoTrim processes 4 files in parallel thanks to native Rust code",
      },
      xmlTimeline: {
        title: "XML Timeline",
        description: "Forget the multi-XML mess. One clean export, every time.",
      },
    },
    numbersSpeak: "The Numbers Speak for Themselves",
    whyBetter: "Why it's better than other tools",
    comparisonTable: {
      headers: {
        manual: "Manual",
        otherTools: "Other Tools",
        autoTrim: "AutoTrim",
      },
      rows: {
        processingTime: {
          label: "Processing time",
          manual: "48 min",
          otherTools: "~20 min",
          autoTrim: "1m 40s",
        },
        timelineOutput: {
          label: "Timeline Output",
          manual: "Many files",
          otherTools: "Puzzle",
          autoTrim: "One XML",
        },
        privacy: {
          label: "Privacy",
          manual: "—",
          otherTools: "Often Cloud",
          autoTrim: "100% Local",
        },
      },
    },
  },

  // Testimonials.jsx
  testimonials: {
    trustedBy: "Trusted by creators and professionals worldwide",
    joinUsers: "Join 10,000+ satisfied users",
    startTrial: "Start Your Free Trial",
  },

  // FinalCTA.jsx
  finalCTA: {
    title: "Still Not Sure?",
    calculation: {
      spending: "You're spending 5 hours/week trimming videos.",
      yearly: "260 hours a year",
      withAutoTrim: "With AutoTrim, you get 96% of that time back.",
      saved: "250+ hours saved — every single year.",
    },
    question: "What's your time worth?",
    atRate: "At $50/hour, that's $12,500 saved annually.",
    startNow: "Start Saving Time Now",
    badges: {
      freeTrial: "Free to try",
      moneyBack: "14-day money back",
      oneTime: "One-time payment",
      localPrivate: "100% local & private",
    },
  },

  // VideoDemo.jsx
  videoDemo: {
    title: "See AutoTrim in Action",
    subtitle: "AutoTrim cuts, cleans, and organizes your footage — all in seconds.",
    watchAction: "Watch it in action:",
    demoTitle: "AutoTrim Demo",
    thumbnail: "Preview thumbnail of the AutoTrim demo video",
    watchDemo: "▶ Watch 90s Demo",
    oneClick: "From raw footage to clean timeline in one click",
    iframeTitle: "AutoTrim Demo",
    noVideoId: "Set NEXT_PUBLIC_VIMEO_ID to enable the demo video.",
  },

  // Features.jsx (badges)
  features: {
    badges: {
      noSubscription: "No subscription",
      instantResults: "Instant results",
      privateSecure: "100% private",
      worksOffline: "Works offline",
    },
  },

  // ProcessSteps.jsx
  processSteps: {
    title: "How to Automatically Trim Video Silences in Seconds",
    subtitle: "From raw clips to a clean timeline — here's how AutoTrim works",
    stepCounter: "Step",
    of: "of 3",
    autoTrimLabel: "AutoTrim",
    otherToolsLabel: "Other Tools",
    steps: {
      drop: {
        title: "Drop your files",
        description: "Drag & drop your clips. They appear instantly in the queue, ready to go.",
        alt: "Drag and drop video files into AutoTrim interface for automatic silence removal",
      },
      trim: {
        title: "Trim in parallel",
        description: "Hit \"Process\" and let AutoTrim analyze all files at once. Preview your timeline as soon as a clip is done.",
        alt: "AutoTrim processing multiple video files in parallel with automatic silence detection",
      },
      export: {
        title: "One timeline, all clips",
        description: "AutoTrim automatically merges ALL your processed clips into ONE single timeline. Everything is already assembled and ready to edit - just export and go.",
        alt: "Single unified timeline export with all clips already assembled in AutoTrim",
      },
    },
  },

  // PerksGrid.jsx
  perksGrid: {
    title: "Why creators never go back.",
    subtitle: "From drag-and-drop to clean XML, AutoTrim is packed with features that save time — and sanity.",
    badges: {
      popular: "Popular",
      comingSoon: "COMING SOON",
    },
    lovedBy: "Loved by 10,000+ creators worldwide",
    perks: {
      dragDrop: {
        title: "Drag & Drop Everything",
        description: "Drop any number of clips; AutoTrim ingests them instantly, whatever the format.",
      },
      smartPresets: {
        title: "Smart Presets",
        description: "YouTube, Podcast, Vlog… one click applies the perfect settings.",
      },
      fineTune: {
        title: "Fine-Tune Cuts",
        description: "Silence threshold, pre/post-roll, min gap – dial in your exact editing style.",
      },
      xmlExport: {
        title: "Single or Multi-XML",
        description: "Export one clean timeline or individual XMLs – no more puzzle pieces.",
      },
      localProcessing: {
        title: "100% Local Processing",
        description: "AI, video processing, everything runs on your machine. No uploads, no waiting, maximum speed.",
      },
      parallelProcessing: {
        title: "Parallel Processing",
        description: "Max out your cores: up to 4 jobs run side-by-side for zero downtime.",
      },
      repetitionRemover: {
        title: "Repetition & Hesitation Remover",
        description: "Cuts filler words and double-takes automatically.",
      },
      multilingual: {
        title: "Multilingual & Format-Agnostic",
        description: "French, English, Spanish… MP4, MOV, MKV – it just works.",
      },
      blazingPreview: {
        title: "Blazing-Fast Preview",
        description: "Scrub in real-time, no lag, even on long footage.",
      },
      optimizedPro: {
        title: "Optimized for Pro Editing Machines",
        description: "AutoTrim is built for the hardware you already own. It runs AI models locally, using the full power of your CPU and GPU — with no slow uploads and no extra server costs.",
      },
    },
  },

  // WhoIsItFor.jsx
  whoIsItFor: {
    title: "AutoTrim is Made For",
    subtitle: "Whether you're creating content full-time or just getting started, AutoTrim saves you hours every week.",
    stats: {
      happyCreators: "10,000+ happy creators",
      hoursSaved: "Millions of hours saved",
    },
    joinThousands: "Join thousands of creators who've reclaimed their time",
    personas: {
      youtubers: {
        title: "YouTubers & Vloggers",
        description: "Ship videos faster without the tedious trimming",
        benefit: "10+ hours saved/week",
      },
      podcasters: {
        title: "Podcasters",
        description: "Clean up long-form content in minutes, not hours",
        benefit: "3x faster editing",
      },
      teachers: {
        title: "Online Teachers",
        description: "Focus on teaching, not editing your courses",
        benefit: "More time to teach",
      },
      freelancers: {
        title: "Freelance Editors",
        description: "Handle more clients by cutting editing time",
        benefit: "2x client capacity",
      },
      teams: {
        title: "Content Teams",
        description: "Scale video production without scaling headcount",
        benefit: "Team productivity boost",
      },
      anyCreator: {
        title: "Any Creator Who Values Time",
        description: "If you edit videos regularly, AutoTrim is for you",
        benefit: "Hours back daily",
      },
    },
  },

  // TimeSavings.jsx
  timeSavings: {
    title: "AutoTrim saves you time. A lot of time.",
    subtitle: "See how much faster your workflow becomes",
    percentManual: "% of manual time",
    methods: {
      manual: {
        name: "Manual editing",
        description: "Traditional workflow",
        time: "48 min",
        speed: "1×",
      },
      otherTools: {
        name: "Other tools",
        description: "Semi-automated",
        time: "20 min",
        speed: "2.4× faster",
      },
      autoTrim: {
        name: "AutoTrim",
        description: "Fully automated",
        time: "1 min",
        speed: "48× faster",
      },
    },
    realCase: {
      title: "Based on a real client case: 30 min of raw footage",
      test: {
        title: "Real test case",
        rawClip: "Raw clip",
        duration: "1 min 33 s",
        manualFCP: "Manual (FCP)",
        manualTime: "2 min 30 s (150 s)",
        autoTrimLabel: "AutoTrim",
        autoTrimTime: "8 s",
        result: "≈ 19× faster",
      },
      scenario: {
        title: "Realistic scenario (client case)",
        description: "6 clips of 5 min = 30 min raw",
        manualCalc: "Manual (FCP): 30 min × 1.61 ≈ 48 min 18 s",
        autoTrimCalc: "AutoTrim: batch processing on 30 min raw = 1 min total",
        manualTotal: "Manual total",
        manualTotalTime: "48 min 18 s",
        autoTrimTotal: "AutoTrim total",
        autoTrimTotalTime: "1 min",
        timeSaved: "Time saved",
        timeSavedAmount: "~47 min 18 s",
        reduction: "~97.9% reduction — ≈ 48× faster",
      },
      vsOtherTools: {
        title: "Vs. other tools",
        similarSpeed: "Similar per‑clip processing speed (~50 s)",
        noParallel: "No parallel processing",
        oneXmlPerClip: "One XML per clip → manual merge in FCP",
        sequential: "Sequential: 6 × 50 s = 5 min + merge 6 × 2 min 30 s = 15 min → 20 min total",
        autoTrimBetter: "AutoTrim: 1 min + single XML → no merge",
        gain: "Gain: ~19 min — 95% reduction — ≈ 20× faster",
      },
      notes: "Notes: tests réalisés sur des rushs parlés, timings variables selon machine, source audio et paramètres.",
    },
  },

  // Pricing.jsx
  pricing: {
    title: "Choose Your Plan",
    subtitle: "AutoTrim is free to try. Pay only when you're ready to export.",
    plans: {
      annual: {
        title: "Annual",
        price: "$79",
        period: "/year",
        billing: "Billed yearly",
        features: [
          "Unlimited projects",
          "Unlimited clips",
          "1 year of updates",
          "Priority export speed",
          "Activate on 2 machines",
        ],
      },
      lifetime: {
        title: "Lifetime License",
        originalPrice: "$249",
        price: "$149",
        period: "one-time",
        badge: "Best Value",
        earlyBird: "Early bird special",
        features: [
          "Unlimited projects",
          "Unlimited clips",
          "Lifetime updates",
          "Priority export speed",
          "Activate on 2 machines",
        ],
      },
    },
    downloadTrial: "Download Free Trial",
    alreadyTried: "Already tried?",
    buyLicense: "Buy license",
    benefits: {
      freeTry: "Free to try — process your files, preview your cuts.",
      payExport: "Pay only to export your final XML or timeline.",
      moneyBack: "14-day money-back guarantee.",
    },
  },

  // Additional missing keys for existing components
  footer: {
    language: {
      en: "🇬🇧 English",
      fr: "🇫🇷 Français",
      es: "🇪🇸 Español",
      zh: "🇨🇳 中文",
    },
    cta: {
      ready: "Ready to reclaim your time?",
      button: "Try AutoTrim Free",
    },
  },

  whyFaster: {
    ctaButton: "Try AutoTrim Free",
  },
};