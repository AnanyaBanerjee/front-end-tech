---
name: legal
description: Protect every landing page and website with proper copyright notices, trademark symbols, Privacy Policy, Terms of Use, GDPR/CCPA compliance, DMCA protection, and NoAI directives. Always ask the user for existing legal documents first — improve them if they exist, generate from scratch if not. Apply to every project by default.
---

# Legal Protection Skill

## Rule: Apply to Every Project by Default

Legal protection is not optional. Every page built using this repo must implement the full checklist below without being asked.

---

## Step 1: Always Ask First

Before generating any legal content, ask the user these questions:

> **"Before I build your page, I need a few things to protect your work legally:**
>
> 1. **Your full name or company name** — for copyright ownership
> 2. **Your product/brand name** — to apply the ™ symbol correctly
> 3. **Do you already have a Privacy Policy?** If yes, share it and I'll improve it. If no, I'll generate one.
> 4. **Do you already have Terms of Use?** If yes, share it and I'll improve it. If no, I'll generate one.
> 5. **Do you collect any user data?** (email signups, contact forms, analytics, cookies) — this affects what's legally required
> 6. **Where are your users primarily located?** (e.g., worldwide, US only, EU) — affects GDPR/CCPA requirements"

Use the answers to personalise every section below. Never generate generic placeholder legal text — it must reference the actual product name, owner, and data practices.

---

## Step 2: Copyright Notice

Add to the footer of every page. This is the single most important thing — it establishes ownership and is the foundation of all other protection.

```html
<footer>
  <p>© <span id="year"></span> [Owner Name]. All rights reserved.
  [Product Name]™ is a trademark of [Owner Name].</p>
</footer>

<script>
  document.getElementById('year').textContent = new Date().getFullYear();
</script>
```

**Rules:**
- Always use the current year dynamically — never hardcode it
- Use `™` (not `®`) unless the user confirms they have a registered trademark
- "All rights reserved" is still widely recognised and signals intent to enforce
- The owner name should be the legal person or entity, not just a username

**Add to `<head>` as well:**
```html
<meta name="copyright" content="© 2024 [Owner Name]. All rights reserved." />
<meta name="author" content="[Owner Name]" />
```

---

## Step 3: Privacy Policy

### If the user provides an existing Privacy Policy:

Review it and improve it by checking for these gaps. Add any missing sections:

**Required sections checklist:**
- [ ] What data is collected (emails, names, IP addresses, cookies, analytics)
- [ ] How data is used (marketing, product updates, analytics)
- [ ] Who data is shared with (third-party services — list them by name)
- [ ] How long data is retained
- [ ] User rights (access, deletion, opt-out)
- [ ] GDPR rights (if EU users): right to access, rectify, erase, port data
- [ ] CCPA rights (if California users): right to know, delete, opt-out of sale
- [ ] Cookie policy (if using analytics or tracking)
- [ ] Contact details for privacy questions
- [ ] Last updated date

### If the user has no Privacy Policy:

Generate `site/privacy-policy.html` using this template, filled with actual product and owner details:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy — [Product Name]</title>
  <!-- link to main stylesheet -->
</head>
<body>
<main>
  <h1>Privacy Policy</h1>
  <p><strong>Last updated:</strong> [Date]</p>

  <h2>Who we are</h2>
  <p>[Product Name] is operated by [Owner Name]. If you have questions about this policy, contact us at [contact method].</p>

  <h2>What data we collect</h2>
  <p>We collect the following information when you use [Product Name]:</p>
  <ul>
    <!-- Populate based on user's answer to Step 1 Q5 -->
    <!-- Email only: -->
    <li><strong>Email address</strong> — when you sign up for updates or our waitlist</li>
    <!-- If analytics: -->
    <li><strong>Usage data</strong> — pages visited, time on site, browser type, approximate location (via [Analytics Service Name]). This data is anonymised and aggregated.</li>
    <!-- If contact form: -->
    <li><strong>Name and message</strong> — when you contact us via our contact form</li>
  </ul>

  <h2>How we use your data</h2>
  <ul>
    <li>To send product updates and announcements (email only, if you signed up)</li>
    <li>To improve the product based on usage patterns (analytics only)</li>
    <li>To respond to your enquiries (contact form submissions)</li>
    <li>We do not sell your data to third parties. Ever.</li>
  </ul>

  <h2>Third-party services</h2>
  <p>We use the following third-party services that may process your data:</p>
  <ul>
    <!-- Populate based on actual services used -->
    <li><strong>[Form Service, e.g. Formspree]</strong> — handles contact form submissions. <a href="[their privacy policy URL]" rel="noopener noreferrer">Their privacy policy</a>.</li>
    <li><strong>[Analytics, e.g. Plausible/Fathom]</strong> — privacy-friendly analytics. No cookies, no personal data. <a href="[their privacy policy URL]" rel="noopener noreferrer">Their privacy policy</a>.</li>
  </ul>

  <h2>Cookies</h2>
  <!-- If no tracking/analytics: -->
  <p>[Product Name] does not use tracking cookies or advertising cookies. We do not use Google Analytics or Facebook Pixel.</p>
  <!-- If using analytics: -->
  <p>We use [Analytics Service] which does not set cookies or track individuals across sites.</p>

  <h2>Data retention</h2>
  <p>Email addresses are retained until you unsubscribe. Contact form submissions are retained for [X] months. Analytics data is aggregated and never tied to individuals.</p>

  <h2>Your rights</h2>
  <p>You have the right to:</p>
  <ul>
    <li>Request a copy of the data we hold about you</li>
    <li>Request deletion of your data</li>
    <li>Unsubscribe from emails at any time using the link in any email</li>
    <li>Lodge a complaint with your local data protection authority</li>
  </ul>

  <!-- If EU users: -->
  <h2>GDPR (EU users)</h2>
  <p>If you are located in the European Union, you have additional rights under the GDPR including the right to data portability and the right to object to processing. Our legal basis for processing your email address is your explicit consent (opt-in). Contact us to exercise any of these rights.</p>

  <!-- If California users: -->
  <h2>CCPA (California users)</h2>
  <p>California residents have the right to know what personal information we collect, the right to delete it, and the right to opt-out of its sale. We do not sell personal information. To exercise your rights, contact us at [contact method].</p>

  <h2>Contact</h2>
  <p>For any privacy-related questions: [contact method]</p>

  <h2>Changes to this policy</h2>
  <p>We will update this page if our practices change. The "last updated" date at the top will reflect any changes.</p>
</main>
</body>
</html>
```

---

## Step 4: Terms of Use

### If the user provides existing Terms of Use:

Review and improve them. Check for these commonly missing protections:

**Required sections checklist:**
- [ ] What the service is and what it's NOT (limits your liability)
- [ ] Acceptable use — what users may not do
- [ ] Intellectual property — you own the product, content, and brand
- [ ] Disclaimer of warranties (you provide the service "as is")
- [ ] Limitation of liability (caps your legal exposure)
- [ ] Governing law (which country/state's laws apply)
- [ ] How to contact you for legal matters
- [ ] Right to modify or discontinue the service
- [ ] Last updated date

### If the user has no Terms of Use:

Generate `site/terms.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terms of Use — [Product Name]</title>
</head>
<body>
<main>
  <h1>Terms of Use</h1>
  <p><strong>Last updated:</strong> [Date]</p>
  <p>By using [Product Name], you agree to these terms. If you do not agree, do not use the service.</p>

  <h2>What [Product Name] is</h2>
  <p>[Brief factual description of what the product does]. These terms apply to your use of [Product Name] and any related services operated by [Owner Name].</p>

  <h2>Acceptable use</h2>
  <p>You agree not to:</p>
  <ul>
    <li>Use [Product Name] for any unlawful purpose</li>
    <li>Attempt to reverse-engineer, copy, or reproduce any part of [Product Name]</li>
    <li>Scrape, harvest, or systematically extract content or data from [Product Name]</li>
    <li>Interfere with or disrupt the service or its infrastructure</li>
    <li>Impersonate [Owner Name] or [Product Name] in any way</li>
  </ul>

  <h2>Intellectual property</h2>
  <p>All content, design, code, trademarks, and materials on [Product Name] are owned by [Owner Name] and protected by applicable intellectual property laws. [Product Name]™ is a trademark of [Owner Name]. You may not use our name, logo, or branding without written permission.</p>

  <h2>No warranties</h2>
  <p>[Product Name] is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or meet your specific requirements.</p>

  <h2>Limitation of liability</h2>
  <p>To the maximum extent permitted by law, [Owner Name] shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of [Product Name], even if we have been advised of the possibility of such damages.</p>

  <h2>Governing law</h2>
  <p>These terms are governed by the laws of [Country/State]. Any disputes shall be resolved in the courts of [Jurisdiction].</p>

  <h2>Changes to these terms</h2>
  <p>We may update these terms at any time. Continued use of [Product Name] after changes constitutes acceptance of the new terms. The "last updated" date will reflect any changes.</p>

  <h2>Contact</h2>
  <p>For legal enquiries: [contact method]</p>
</main>
</body>
</html>
```

---

## Step 5: DMCA Protection Notice

Add to the footer and to a `site/dmca.html` page. This signals that you will pursue copyright infringement:

**Footer addition:**
```html
<p>Content on this site is protected by copyright. Unauthorised reproduction is prohibited.
<a href="/dmca.html">DMCA Policy</a></p>
```

**`site/dmca.html`:**
```html
<h1>DMCA Policy</h1>
<p>All content on [Product Name], including text, images, design, and code, is owned by [Owner Name] and protected under copyright law.</p>

<h2>Reporting infringement</h2>
<p>If you believe your copyrighted work has been reproduced on this site without authorisation, contact us at [contact method] with:</p>
<ul>
  <li>A description of the copyrighted work you believe has been infringed</li>
  <li>The URL where the alleged infringement appears on our site</li>
  <li>Your contact information</li>
  <li>A statement that you have a good faith belief that the use is not authorised</li>
</ul>

<h2>Infringement of our content</h2>
<p>We actively monitor for unauthorised use of our content. If we discover our content has been reproduced without permission, we will issue a DMCA takedown notice to the hosting provider and/or the infringing party.</p>
```

---

## Step 6: NoAI and NoArchive Directives

Add to `<head>` to signal that content should not be used for AI training or cached without permission. Ethical crawlers respect these — they do not stop bad actors, but they create a legal paper trail.

```html
<!-- Prevent AI training on content -->
<meta name="robots" content="index, follow, noai, noimageai" />

<!-- Prevent web archive caching (optional — remove if you want archive.org to index you) -->
<!-- <meta name="robots" content="noarchive" /> -->
```

Add to `site/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /private/

# Opt out of AI training crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Omgilibot
Disallow: /

Sitemap: https://yoursite.com/sitemap.xml
```

> **Note:** Blocking AI crawlers from robots.txt prevents your content from being used for AI training, but it may also reduce your visibility in AI-powered search features. It's a trade-off — ask the user which they prefer.

---

## Step 7: Footer Links

Every page footer must include links to the legal pages:

```html
<footer>
  <p>© <span id="year"></span> [Owner Name]. All rights reserved. [Product Name]™</p>
  <nav aria-label="Legal">
    <a href="/privacy-policy.html">Privacy Policy</a> ·
    <a href="/terms.html">Terms of Use</a> ·
    <a href="/dmca.html">DMCA</a>
  </nav>
</footer>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
```

---

## Step 8: Legal Checklist

Run before finishing any page:

**Copyright**
- [ ] Footer copyright notice with dynamic year and owner name
- [ ] `™` on product name (not `®` unless registered)
- [ ] `<meta name="copyright">` in `<head>`

**Privacy Policy**
- [ ] `site/privacy-policy.html` exists
- [ ] All data collection methods are accurately described
- [ ] All third-party services are named
- [ ] GDPR section included if EU users are expected
- [ ] CCPA section included if US/California users are expected
- [ ] Contact method provided

**Terms of Use**
- [ ] `site/terms.html` exists
- [ ] Intellectual property section names the product and owner
- [ ] Limitation of liability clause included
- [ ] Governing law specified

**DMCA**
- [ ] `site/dmca.html` exists
- [ ] Footer links to DMCA page

**NoAI**
- [ ] `noai` meta tag in `<head>`
- [ ] AI training crawlers blocked in `robots.txt`
- [ ] User has been asked whether they want to block AI crawlers

**Footer**
- [ ] Links to Privacy Policy, Terms of Use, and DMCA on every page

---

## Important Disclaimer

This skill generates legally-informed starting points, not legal advice. For products that handle significant user data, financial transactions, health information, or that operate in regulated industries — consult a qualified lawyer. The generated documents are solid for most indie products and early-stage projects, but complex situations need professional review.
