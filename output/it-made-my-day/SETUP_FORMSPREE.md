# Formspree Setup — Request a Feature Form

The feature request form on `site/request-feature.html` needs a Formspree endpoint to send you email notifications when someone submits a suggestion.

## Steps

1. Go to [formspree.io](https://formspree.io) and sign up (free tier is fine)
2. Click **New Form** and name it something like `ItMadeMyDay Feature Requests`
3. Set the notification email to `ananyabilbanerjee@gmail.com`
4. Copy the **Form ID** — it's the string after `/f/` in your form endpoint, e.g. `xabcdefg`
5. Open `site/request-feature.html` and find this line (near the bottom, in the `<script>` block):

   ```js
   var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_FORM_ID';
   ```

6. Replace `YOUR_FORMSPREE_FORM_ID` with your actual ID:

   ```js
   var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xabcdefg';
   ```

7. Save and redeploy to Cloudflare Pages.

## What happens after setup

- Every form submission sends an email to `ananyabilbanerjee@gmail.com` with the user's name, email, and suggestion
- The subject line will be: **New Feature Request — ItMadeMyDay**
- After submitting, the user's browser automatically opens the Substack subscribe page with their email pre-filled: `https://buildroomananya.substack.com/subscribe?email=...`
