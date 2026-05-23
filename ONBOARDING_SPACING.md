# Onboarding spacing

The spacing should be tightened into a simple 8-point rhythm, with a few 4-point exceptions for tiny elements, so the screen feels more intentional and less vertically loose. For this kind of mobile onboarding UI, larger touch targets and simpler layouts also benefit from clearer grouping and more predictable gaps between sections.

## Spacing system

Use an 8-point base scale for most vertical and horizontal spacing: **8, 16, 24, 32, 40, 48, and 56 px**, with **4 or 12 px** only for micro-adjustments like icon gaps, dot spacing, or tiny badge padding. This keeps the design consistent and maps well to common mobile UI patterns and platform spacing practices.

## Recommended values

For all onboarding slides (welcome / personalize / celebration), a clean spec would be:

| Area | Value |
| --- | --- |
| Screen side padding | 24 px |
| Top safe area to badge | 32–40 px |
| Badge to headline | 24 px |
| Headline line break gap | 0–8 px optical adjustment, depending on font |
| Headline to subtext | 16–24 px |
| Subtext to mascot/card cluster | 32 px |
| Gap between overlapping mascot and lesson card | 16–24 px visual offset |
| Mascot cluster to progress card | 24–32 px |
| Progress card to primary CTA | 40 px |
| Primary CTA to secondary link | 24 px |
| Secondary link to pagination dots | 24–32 px |

## Component padding

Use **16–24 px** internal padding inside cards, and keep the primary button height around **56 px** so it remains easy to tap and visually strong.

Small elements like the badge and pagination dots can use tighter **8–12 px** internal spacing because 4-point adjustments are appropriate for compact secondary UI details.

## Grouping rules

Treat the screen as four visual groups:

1. **Intro text** — badge, headline, subtext
2. **Mascot / lesson moment** — mascot illustration and overlapping lesson card
3. **Progress status** — progress card
4. **Action area** — primary CTA, secondary link, pagination dots

Use tighter spacing **inside** each group and larger spacing **between** groups. That pattern improves hierarchy because spacing itself communicates which items belong together and which are separate sections.

## What to fix

The main issue is likely excessive empty space between the intro copy, mascot block, and bottom CTA zone, which weakens momentum on an onboarding screen. A better version would:

- Reduce dead space
- Align all major blocks to the same side margins
- Reuse **24 px** and **32 px** gaps repeatedly instead of mixing too many visually different distances

## Spacing tokens

A practical spacing token set for this design:

| Token | Value |
| --- | --- |
| `XS` | 8 |
| `SM` | 16 |
| `MD` | 24 |
| `LG` | 32 |
| `XL` | 40 |
| CTA height | 56 |

These map to `onboardingSpace`, `tightSlideSpacing` (slides 1–3), and `celebrationSlideSpacing` (slide 3 only) in `constants/onboarding-spacing.ts`.
