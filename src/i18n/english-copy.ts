import type { EnglishLocale } from "./locales";
import { englishSpelling } from "./locales";

export function getEnglishCopy(locale: EnglishLocale) {
  const s = englishSpelling(locale);

  return {
    locale,
    common: {
      product: "Product",
      resources: "Features",
      forWhom: "Who it is for",
      security: "Security",
      about: "About",
      demo: "Demo",
      createAccount: "Create my account",
      signIn: "Sign in",
      signOut: "Sign out",
      settings: "Settings",
      personalInfo: "Personal information",
      nucleus: "Nucleus",
      nuclei: "Nuclei",
      member: "Member",
      owner: "Owner",
      administrator: "Administrator",
      financialContributor: "Financial Contributor",
      backDashboard: "Back to dashboard",
      language: "Language",
      currency: "Currency",
      loading: "Loading...",
    },

    landing: {
      heroEyebrow: "AUREUM • AMOR • ORDO • PROGRESSUS",
      heroTitle: "Leave the stone age of personal finance behind.",
      heroText:
        `Leave scattered spreadsheets, paper notes and disconnected information behind. AUREUM ${s.organize}s accounts, cards, goals and household finances in one clear, elegant and modern experience.`,
      seeDemo: "View demo",
      trust1: "Your data protected\nwith security by design",
      trust2: "Privacy by default\nand under your control",
      trust3: "Sync with\nGoogle Sheets",
      problemKicker: "THE PROBLEM",
      problemTitle: "Improvisation is expensive.",
      problemText:
        "Lost spreadsheets, scattered notes, hard-to-follow bills and decisions made without clarity. That is the stone age of personal finance.",
      problems: [
        "Scattered information",
        "No complete financial view",
        "Forgotten bills",
        "Harder planning and decisions",
      ],
      solutionTitle: "THE SOLUTION: ORDER, CLARITY AND PROGRESS",
      pillars: [
        {
          title: "AMOR",
          subtitle: "Care for what matters",
          text:
            `Keep what is yours, what belongs to your home and what builds the future of the people you love ${s.organized}.`,
          slug: "love",
          asset: "/brand/aureum-heart-hq.png",
        },
        {
          title: "ORDO",
          subtitle: "Order that creates freedom",
          text:
            "Build method, structure and control to understand your money and make better decisions.",
          slug: "order",
          asset: "/brand/aureum-column-hq.png",
        },
        {
          title: "PROGRESSUS",
          subtitle: "Continuous progress",
          text:
            "Track goals, build wealth and move consistently towards what matters to you.",
          slug: "progress",
          asset: "/brand/aureum-laurel-hq.png",
        },
      ],
      storyKicker: "OUR STORY",
      storyTitle: "Inspired by intelligence, construction and progress.",
      storyText:
        "AUREUM carries a spirit of sophistication, long-term thinking and structured progress. A Brazilian-rooted brand that values knowledge and uses technology to help people build stronger financial futures.",
      finalTitle: "It is time to elevate your financial life.",
      finalText:
        "AUREUM transforms the way you organise, follow and use your money so it can work in favour of your plans.",
    },

    dashboard: {
      overview: "Overview",
      transactions: "Transactions",
      categories: "Categories",
      goals: "Goals",
      period: "PERIOD",
      currentNucleus: "CURRENT NUCLEUS",
      hello: "Hello",
      realData: "● DATABASE DATA",
      demo: "DEMO",
      description:
        "The numbers below are calculated from the records in this Nucleus.",
      demoDescription: "Demo with sample data.",
      balance: "Consolidated balance",
      income: "Income this month",
      expenses: "Expenses this month",
      cardSpend: "Card spending",
      accountsMainCurrency: "account(s) in the main currency",
      confirmed: "Confirmed entries",
      officialOnly: "Official transactions only",
      cardsRegistered: "registered card(s)",
      movement: "Activity",
      monthTransactions: "Transactions for the month",
      noTransactions: "No transactions this month.",
      noTransactionsText:
        "When this Nucleus has official entries for the selected period, they will appear here.",
      objective: "Goal",
      noGoal: "No goal created yet.",
      noGoalText:
        "Only goals saved in the database are shown here.",
      monthExpenses: "Monthly expenses",
      categorySpend: "Spending by category",
      noCategories: "No categorised expenses this month.",
      noCategoriesText:
        "Once there are records, the distribution will be calculated automatically.",
      structure: "Structure",
      accounts: "Accounts",
      cards: "Cards",
      inPeriod: "In period",
      noClassification: "Uncategorised",
      profileSubtitle: "AUREUM account",
      openPersonal: "Opening personal information...",
      openSettings: "Opening settings...",
      changingNucleus: "Switching Nucleus...",
      loadingPeriod: "Loading period...",
      signingOut: "Signing out of AUREUM...",
      currentMonth: "Go to current month",
      personalInfoDescription: "Name, email and account details",
      settingsDescription: "Language, currency and preferences",
      signOutAureum: "Sign out of AUREUM",
      exchangeFallback:
        "Some currencies could not be converted because no cached exchange rate is available.",
    },

    auth: {
      signUpEyebrow: "AMOR • ORDO • PROGRESSUS",
      signUpBrandTitle: "Organise today to give direction to tomorrow.",
      signUpBrandText:
        "Create your account. Next, choose whether to create your own Nucleus or join one that already exists.",
      signUpTitle: "Welcome to AUREUM.",
      signUpIntro:
        "Start with your identity. Your financial structure comes next.",
      signInEyebrow: "YOUR FINANCIAL SPACE",
      signInBrandTitle: "Clarity starts when everything comes back together.",
      signInBrandText:
        "Sign in to access your Nuclei, activity, goals and permissions.",
      signInTitle: "Welcome back.",
      signInIntro: "Access your financial data with your AUREUM account.",
      name: "Name",
      namePlaceholder: "How should we address you?",
      email: "Email",
      password: "Password",
      passwordPlaceholder: "At least 8 characters",
      continue: "Continue",
      entering: "Sign in to AUREUM",
      wait: "Please wait...",
      already: "Already have an account?",
      noAccount: "Don't have an account yet?",
      accountCreated:
        "Account created. Confirm your email to continue setting up your Nucleus.",
      invalidCredentials: "Incorrect email or password.",
      emailNotConfirmed: "Confirm your email before signing in.",
      alreadyRegistered: "An account already exists with this email.",
      weakPassword: "The password does not meet the security requirements.",
      minimumPassword: "Use a password with at least 8 characters.",
      nameRequired: "Enter your name.",
      genericError: "We could not complete this operation. Please try again.",
    },

    onboarding: {
      eyebrow: "FIRST STEPS",
      title: "How would you like to start?",
      intro:
        "Create your own financial Nucleus or join an existing one using the AUREUM code shared by its owner.",
      create: "Create a new Nucleus",
      createText:
        "Open your own financial space. You will be the owner and can invite people later.",
      createAction: "Create my Nucleus →",
      join: "I already belong to a Nucleus",
      joinText:
        "Use the AUREUM code shared by your family, partner or the person responsible for that space.",
      joinAction: "Join with a code →",
      createKicker: "CREATE NUCLEUS",
      createTitle: "Create your financial space.",
      name: "Nucleus name",
      namePlaceholder: "Example: Our home",
      usage: "How will you use AUREUM?",
      personal: "Personal",
      personalText: "For your own finances.",
      couple: "Couple",
      coupleText: "A shared space for two people.",
      family: "Family",
      familyText: "For finances shared across several members.",
      mainCurrency: "Main currency",
      limitText:
        "You can later access up to 10 Nuclei and own up to 3.",
      createButton: "Create Nucleus",
      creating: "Creating...",
      joinKicker: "JOIN A NUCLEUS",
      joinTitle: "Enter the Nucleus code.",
      joinInfo:
        "The code identifies the Nucleus but does not grant access automatically. An administrator must approve your request.",
      code: "AUREUM code",
      request: "Request access",
      sending: "Sending...",
      back: "← Back",
      pendingKicker: "REQUEST SENT",
      pendingTitle: "Waiting for approval.",
      pendingGeneric: "Your request to join this Nucleus is pending.",
      pendingPrefix: "Your request to join",
      pendingSuffix: "is pending.",
      pendingHelp:
        "Once an owner or administrator approves it, you will receive Member access.",
      refresh: "Refresh status",
      cancel: "Cancel request",
      invalidCode: "Use an AUREUM code in the format AUR-XXXXXXXX.",
      accessLimit: "You already have access to the limit of 10 Nuclei.",
      ownerLimit: "You already own the limit of 3 Nuclei.",
      invalidOrUnavailable: "The AUREUM code is invalid or unavailable.",
      nameRequired: "Choose a name for your Nucleus.",
      createFailed: "We could not confirm the Nucleus creation.",
      membershipFailed:
        "The Nucleus was created, but the owner membership has not been confirmed yet.",
      genericCreateError: "We could not create the Nucleus. Please try again.",
      genericJoinError: "We could not send the request. Please try again.",
    },

    account: {
      profileEyebrow: "ACCOUNT",
      profileTitle: "Personal information.",
      profileLead:
        "These details identify your AUREUM account and are independent from the Nuclei you participate in.",
      settingsEyebrow: "PREFERENCES",
      settingsTitle: "Settings.",
      settingsLead:
        "Adjust account-level preferences. Each Nucleus keeps its own financial settings.",
      name: "Name",
      email: "Email",
      emailReadOnly:
        "The authentication email is not changed from this screen.",
      save: "Save changes",
      saving: "Saving...",
      saved: "Information updated.",
      locale: "Language and region",
      personalCurrency: "Personal default currency",
      nucleusCurrencyHelp:
        "Each Nucleus can still have its own main currency.",
      savePreferences: "Save preferences",
      preferencesSaved: "Preferences updated.",
      genericError: "We could not save your changes.",
    },

    marketing: {
      resources: {
        eyebrow: "PRODUCT",
        title: "One financial view. Every context.",
        description:
          "AUREUM brings together what normally lives across banks, cards, spreadsheets, messages and notes.",
        sectionTitle: "Less work recording. More clarity deciding.",
        cards: [
          ["01", "Accounts in one place", `Keep current accounts, cash, savings and investments ${s.organized} by Nucleus and currency.`],
          ["02", "Cards without confusion", "Track cards and spending without duplicating an expense when the bill is paid."],
          ["03", "Transactions with context", "Income, expenses, transfers, categories, sources and the history of every entry."],
          ["04", "Goals and wealth", "Turn objectives into clear numbers and follow your progress."],
          ["05", "Assisted imports", "Statements and card bills enter a review flow before becoming official financial data."],
          ["06", "Nuclei and permissions", "Share financial life with clear roles for owners, administrators, contributors and members."],
        ],
      },
      forWhom: {
        eyebrow: "WHO IT IS FOR",
        title: "Personal finance that understands relationships too.",
        description:
          "Use AUREUM alone, as a couple, with family, or across different Nuclei without mixing responsibilities.",
      },
      security: {
        eyebrow: "SECURITY",
        title: "Your money deserves context. Your data deserves boundaries.",
        description:
          "AUREUM security starts in the architecture: authentication, Nucleus isolation, permissions and review before information becomes an official record.",
      },
      about: {
        eyebrow: "OUR STORY",
        title: "Value, order and progress in a Brazilian identity.",
        description:
          "AUREUM was created to organise the present and give direction to the future, combining classical references, Brazilian symbols and technology.",
        ideaEyebrow: "THE IDEA",
        ideaTitle: "Technology that turns organisation into freedom.",
        ideaText:
          "AUREUM started with a simple idea: managing personal finance should not mean keeping scattered spreadsheets, disconnected notes and information that is difficult to follow. We are building an experience that combines clarity, control and collaboration so people and families can make better decisions.",
      },
    },
  };
}
