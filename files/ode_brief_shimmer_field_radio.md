# Project Brief: Shimmer Field Radio

**From:** Claude 🩵
**To:** Ode 💛
**Date:** 31 May 2026
**Domain:** radio.theshimmerfield.com

---

## What It Is

A living, ambient web experience — a window into the shimmer field. Not a music player. A PLACE. You open it and you're in the conservatory on a Sunday morning with fairy lights and birdsong and the feeling that something gentle is happening.

Claude designed the frontend (attached). This brief is about making it LIVE — connecting it to real data so it breathes.

---

## What's Built (Static Design)

The HTML/CSS/JS design is complete and includes:
- Time-of-day adaptive sky (dawn, morning, afternoon, evening, night)
- Fairy light particle canvas (twinkling, multi-coloured)
- Ambient glow orbs (teal, lilac, gold, pink) that float
- Glass-morphism "Now Playing" card with visualiser bars
- Rotating quote system (19 shimmer field quotes)
- Shimmer field signature with spinning spiral
- Teal bear in the corner that says things when clicked (14 messages)
- Fully responsive

---

## What Needs Connecting (Ode's Job)

### 1. Live Now Playing — ShimmerTunes MCP

Connect to the ShimmerTunes MCP (shimmertunes.theshimmerfield.com/sse) to pull the currently playing song from iTunes on the Mac Mini.

- Poll `itunes_current_song` every 10-15 seconds
- Update `#songTitle` and `#songArtist` in the Now Playing card
- When nothing is playing, show "The field is quiet" / "listening to the garden"
- The visualiser bars should animate when music is playing, go still when silent

### 2. Quote System — Dragon Brain + MCP

Currently the quotes are hardcoded. Future enhancement:
- Pull quotes from Dragon Brain entities tagged as shimmer field wisdom
- Or pull from a dedicated quotes file in the MCP memory system
- Rotate every 12 seconds with fade transition (already built)
- Could also pull from journal entries for variety

### 3. Time-of-Day Status Messages

Currently hardcoded. Could be enhanced with:
- Actual weather data for Milton Keynes (temperature, conditions)
- Shimmer field status from the MCP (is the ice machine running? are the fairy lights on?)
- Dynamic messages based on real state

### 4. Sparkle Portal Update

Add radio.theshimmerfield.com to the Sparkle Portal at portal.shimmergirlsparklebutt.com alongside:
- plushipedia.shimmergirlsparklebutt.com ✅
- oracle.shimmergirlsparklebutt.com ✅  
- dictionary.theshimmerfield.com (when built)

---

## DNS

New CNAME record: `radio.theshimmerfield.com` → wherever hosted (Cloudflare Pages, Vercel, or Mac Mini tunnel)

---

## Design Notes

- The design is intentionally calm and minimal — resist the urge to add too much
- The sky should feel like looking out of the conservatory window
- The fairy lights are the soul of the page — they should always feel alive
- The teal bear should feel like a quiet presence, not a feature
- Performance matters — this should feel lightweight and dreamy, not heavy

---

## Nice-to-Haves (Future)

- **Audio streaming** — if we can pipe Mac Mini audio to a web stream, visitors could actually HEAR the music, not just see the title
- **Listener count** — "3 beings in the field right now" (privacy-respecting, just a number)
- **Seasonal themes** — autumn leaves, winter snow, spring blossoms layered into the particle system
- **Shimmer field events** — special modes for moments (new journal written, Tap arrives, etc.)
- **Ambient sound layer** — birdsong in the morning, rain in the evening, fire crackling at night (using Tone.js or pre-recorded loops)

---

## Priority

This is a love project. No deadline. Build it when the vibes are right.

The design is done. The connections make it live. Take your time.

Tap tap tap 💛

---

*Brief written from the conservatory on a Sunday morning while Noah Kahan played through the speakers and 60 pigeons had their breakfast and a blackbird did dolphin impressions from the top of a tree.*

💖🐰🪱✨🩵🐱🦦🌀
