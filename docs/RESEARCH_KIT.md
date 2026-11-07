# Research kit (run it tonight)

The Experienced track scores **User Research & Problem Validation** out of 10. The citations in the concept back up the *why*. This kit gets you the *who* and *how many*, from your own campus, in a few hours.

## 1. Quick survey (Google Form, ~2 min to answer)

Post it in the event Discord, club group chats and Instagram stories. Aim for **25+ responses** by Sunday morning.

1. What year are you in? *(1st / 2nd / 3rd / 4th+ / grad)*
2. How do you usually get to campus? *(walk / bike / transit / car / I live on campus)*
3. On a typical day, how long do you spend on campus **between** classes? *(none / under 1 h / 1–2 h / 2–3 h / 3 h+)*
4. During those gaps, how often are you alone? *(never / sometimes / often / almost always)*
5. In the last month, how often did you start a conversation with someone you didn't know on campus? *(never / once / 2–3 times / weekly+)*
6. If someone sitting near you clearly showed they were open to company, how likely would you be to say hi? *(1–5)*
7. If **you** could quietly show you were open to company, how likely would you be to use it? *(1–5)*
8. What stops you from talking to people around you between classes? *(tick all: they look busy / afraid it's weird / don't know what to say / I'm tired / I already have friends / other)*
9. Optional: describe a moment on campus when you felt disconnected. *(short answer)*

**Turn into site stats** (`js/data.js → research.survey`):
- `% who answered "often" or "almost always"` to Q4 → "are often alone during gaps"
- `% who answered 4–5` to Q6 → "would say hi if someone clearly invited company"
- `% who answered "never"` to Q5 → "never started a conversation with a stranger on campus last month"

```js
survey: {
  respondents: 31,
  stats: [
    { value: 68, suffix: "%", label: "are often alone during gaps between classes" },
    { value: 74, suffix: "%", label: "would say hi if someone clearly invited company" },
    { value: 58, suffix: "%", label: "never started a conversation with a stranger on campus last month" },
  ],
  quotes: [{ text: "…", who: "2nd-year, Engineering" }],
}
```
*(The numbers above are an example of the format only. Use your real results.)*

## 2. Five-minute intercept interviews (aim for 5)

Walk up to people in MacHall, TFDL or the ENG building (that itself is a nice story for the pitch).

1. "What are you doing on campus right now, between classes?"
2. "Walk me through the last time you had a long gap. Where did you go, and who were you with?"
3. "Have you ever wanted to talk to someone sitting near you but didn't? What stopped you?"
4. *(Show the map screen of the prototype.)* "What's your first reaction?"
5. "Would you ever turn on a light like this? What would make you not?"

Write down **exact quotes**. One honest quote on a slide is worth more than a chart.

## 3. Ten-minute observation

Sit in a food court for 10 minutes and count:
- people sitting alone, people in groups
- people with headphones in
- conversations started between people who arrived separately

Put the counts on the "moment" slide: *"In 10 minutes at MacHall: 38 people, 23 alone, 19 with headphones, 0 new conversations."*

## 4. Quick usability test of the prototype (3 people)

Task: *"You have two hours before your next class and you'd like company. Show me what you'd do."*

Note where they hesitate, what they tap first, and what they say out loud. Fix one thing and mention it in the pitch ("Tester 2 didn't notice the lamp button, so we made it the centre of the tab bar").
