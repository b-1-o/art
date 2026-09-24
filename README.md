# AER — Art Studio

A production-style contemporary art studio experience built as a portfolio project.

## Stack

- React
- TypeScript
- Vite
- Framer Motion
- Lucide React
- GitHub Pages

## Experience

- Editorial landing page
- Filterable artwork catalogue
- Individual artwork pages
- Inquiry bag with localStorage persistence
- Shop / acquisition flow
- Studio education and mentorship
- Studio statement and process
- Contact / commission form
- Responsive mobile navigation
- Reduced-motion and focus-visible accessibility states
- Dynamic document titles

## Routes

Hash routing keeps the project compatible with GitHub Pages:

- #/
- #/works
- #/works/:id
- #/shop
- #/learn
- #/studio
- #/contact

## Development

npm install
npm run dev

Production:

npm run build
npm run preview

## Visual direction

The site combines editorial typography, large-format artwork, generous negative space, restrained motion, and a soft paper palette. The interaction model is intentionally closer to a gallery catalogue than a conventional storefront.

## Image references

Artwork and gallery imagery in the showcase are referenced from Unsplash. Each image includes an attribution link in the UI.

## Production handoff

The contact form is frontend-only for this portfolio build. For a real client handoff, connect its submit handler to Formspree, Resend, a serverless endpoint, or the client's CMS/backend.

The inquiry bag is quote-first: it collects works locally and sends the visitor to the contact flow before payment or fulfillment.
