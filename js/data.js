/* ------------------------------------------------------------------
   Porchlight — editable content
   Everything the team may need to change before submission lives here.
   ------------------------------------------------------------------ */
window.PORCHLIGHT = {
  team: {
    // e.g. ["Viktor N.", "Teammate 2"] — shown in the footer
    members: [],
    track: "Beginner Track",
  },

  links: {
    caseStudy: "https://github.com/Viktor-Nedev/porchlight/blob/main/docs/CONCEPT.md",
    devpost: "",
    figma: "",
    video: "",
  },

  /* Your own research. The "What we heard on campus" block stays hidden
     until `survey.respondents` is a number, so nothing unverified is shown.
     Fill these in from your survey / interviews (see docs/RESEARCH_KIT.md). */
  research: {
    survey: {
      respondents: null, // e.g. 34
      stats: [
        // { value: 71, suffix: "%", label: "spend 1+ hours alone on campus between classes most days" },
        // { value: 82, suffix: "%", label: "would say yes if someone nearby clearly invited company" },
        // { value: 9,  suffix: "%", label: "have ever started a conversation with a stranger on campus" },
      ],
      quotes: [
        // { text: "I just put my headphones in so it doesn't look like I'm alone.", who: "2nd-year, Nursing" },
      ],
    },
  },
};
