# BankShield AI — Next.js Interactive Demo

A deployable **frontend-only, dummy-data** teaching prototype aligned with the three-stage BankShield AI proposal. Light theme: white/black with blue and gold accents.

## Deploy directly via GitHub → Vercel (no local install)

1. Download and extract `BankShieldAI-NextJS-Prototype.zip` on your computer.
2. Create a **new, empty GitHub repository** (for example, `bankshield-demo`). In the GitHub web interface, use **Add file → Upload files** to upload **the contents of the extracted project directory** — not the ZIP as one file. Make sure `package.json` and the `app` and `lib` folders appear at the repository root. For handling folders in-browser, you can use GitHub's browser editor (`github.dev`) or drag a project folder where supported.
3. At [vercel.com/new](https://vercel.com/new), choose **Import Git Repository**, pick this repository, leave the detected **Next.js** framework and root directory unchanged, then deploy. You do not need to install packages on your PC; Vercel does that during deployment.
4. No environment variables, database, API keys or AWS account needed.

**If Vercel cannot see your Next.js project**, your files were probably committed inside an extra top-level folder. Either move `package.json` to the repository root or set that inner folder as the Vercel Root Directory.

## Main demo flows

- **Home:** three-stage concept, overview and review cases.
- **Customer 360:** select customers; inspect 36 months of transactions; switch between observed, normal fluctuations, sustained decline and recovery. The baseline, recent deviation, persistent-decline flag and demo priority score update together.
- **Churn Intelligence:** view historical baseline, persistence-detection steps and a labelled-churn training example.
- **Growth Matching:** RFM, customer value, actual in-browser K-Means segmentation, ranked simulated product opportunities, and an explanation of per-product XGBoost adoption labels.
- **AI Agent Review:** open the same customer case; inspect simulated specialist-agent messages, policy references, deterministic checks, financial arithmetic, and human review workflow.
- **Policies:** searchable illustrative documents with section/version metadata.
- **Cases:** filter by status and record demo review decisions (session-only).
- **How It Works:** explanatory mapping of calculations vs ML vs agents, and data required from the bank.

## What is real and what is simulated

- Real JavaScript feature calculations: historical monthly averages, deviations, persistence streaks, RFM, plus a small actual K-Means implementation on dummy data.
- Dummy transactions/customers: deterministically generated locally, entirely fictional.
- **Churn risk score:** a **simulated demo priority score**, not a validated churn probability. No real churn classifier is trained or executed.
- **Product scores:** simulated opportunity scores, not validated per-product XGBoost adoption probabilities. The training workflow is illustrated educationally.
- **Agents and RAG:** simulated, scripted explanatory workflow using static fictional policies. No actual Bedrock API, retrieval index, real agent calls or automated banking decisions.
- **Decisions:** front-end state only, reset on refresh. No database or bank connection. Do not store genuine customer information in this project.

## Technology

Next.js 16.4.6, React 19.3.1, vanilla CSS and inline SVG charts. No UI frameworks, chart libraries, external font downloads, image dependencies, server components calling APIs, or environment variables.

## Deployment checks

- Next.js page route is `/` and all demo views are client-side tabs under it.
- `npm run build` is the Vercel build command.
- Node.js >=20.9 is required by Next.js 16.

© BankShield AI demo. Sample documents, customer names, simulated policy rules and costs are fictional and not BancABC policies.
