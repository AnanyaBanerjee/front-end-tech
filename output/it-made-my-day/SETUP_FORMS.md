# Form Setup — Request a Feature Form

The feature request form on `site/request-feature.html` needs a backend to send you email notifications when someone submits a suggestion. Pick any one option below.

---

## Option 1: Web3Forms ✅ DONE — already wired in

- Form name: `ItMadeMyDay Feature Requests`
- Domain: `it-made-my-day.com`
- Access key: `b71218f0-ce9a-4164-802c-1f44e43ffdde`
- The key is already set in `site/request-feature.html` — no further code changes needed

### How it was set up

1. Went to [web3forms.com](https://web3forms.com), entered `ananyabilbanerjee@gmail.com`
2. Created form with name `ItMadeMyDay Feature Requests` and domain `it-made-my-day.com`
3. Got access key: `b71218f0-ce9a-4164-802c-1f44e43ffdde`
4. In `site/request-feature.html`, the endpoint and fetch body were updated to:

   ```js
   var FORMSPREE_ENDPOINT = 'https://api.web3forms.com/submit';
   ```

   ```js
   body: JSON.stringify({
     access_key: 'b71218f0-ce9a-4164-802c-1f44e43ffdde',
     name: nameVal,
     email: emailVal,
     suggestion: suggVal,
     subject: 'New Feature Request — ItMadeMyDay'
   })
   ```

5. `_headers` CSP updated to allow `https://api.web3forms.com` in `connect-src`

### To deploy
Just redeploy `site/` to Cloudflare Pages — it's ready.

---

## Option 2: Formspree

- Free tier, 50 submissions/month
- Sign up at [formspree.io](https://formspree.io)

### Steps

1. Go to [formspree.io](https://formspree.io) and sign up
2. Click **New Form**, name it `ItMadeMyDay Feature Requests`, set notification email to `ananyabilbanerjee@gmail.com`
3. Copy your **Form ID** — the string after `/f/` in your endpoint, e.g. `xabcdefg`
4. Open `site/request-feature.html` and find:

   ```js
   var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_FORM_ID';
   ```

5. Replace `YOUR_FORMSPREE_FORM_ID` with your actual ID:

   ```js
   var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xabcdefg';
   ```

6. Save and redeploy to Cloudflare Pages.

---

## Option 3: EmailJS

- Sends email directly from the browser using your Gmail or Outlook
- Free tier: 200 emails/month
- Sign up at [emailjs.com](https://www.emailjs.com)
- Slightly more setup — you need to create an email service, a template, and get a public key
- Best if you want the email to come from your own Gmail address rather than a third-party sender

---

## Option 4: Cloudflare Workers + Resend

- Zero third-party dependency — fully under your control
- More setup required: write a small Worker function, connect a Resend account for email delivery
- Best if you want to own the whole pipeline or expect high volume

---

## What happens after any setup is complete

- Every form submission sends an email to `ananyabilbanerjee@gmail.com` with the user's name, email, and suggestion
- The subject line will be: **New Feature Request — ItMadeMyDay**
- After submitting, the user's browser automatically opens the Substack subscribe page with their email pre-filled: `https://buildroomananya.substack.com/subscribe?email=...`
