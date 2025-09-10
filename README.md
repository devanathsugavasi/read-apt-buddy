# ReadApt - Accessible Reading Platform

A React-based web application designed to make reading accessible for individuals with dyslexia, ADHD, and vision difficulties through personalized text adaptations.

**Project URL**: https://lovable.dev/projects/42587672-7f76-4f3a-9d59-ae9886e1b122

## 🎯 Features

- **Smart Assessment**: 5-question evaluation to identify reading challenges
- **Text Adaptation**: AI-powered formatting with customizable spacing, fonts, and highlighting  
- **Text-to-Speech**: Natural voice synthesis for auditory learning support
- **Accessibility-First Design**: Built specifically for reading difficulties

## 🏗️ Project Structure

```
src/
├── components/
│   ├── readapt/           # Core ReadApt components
│   │   ├── LandingPage.tsx
│   │   ├── AssessmentForm.tsx
│   │   ├── AssessmentResults.tsx
│   │   └── TextAdaptation.tsx
│   └── ui/                # Essential UI components (12 files)
├── pages/
│   ├── Index.tsx          # Main app routing
│   └── NotFound.tsx       # 404 page
├── hooks/use-toast.ts     # Toast notifications
├── lib/utils.ts           # Utility functions
├── App.tsx                # Root component
├── main.tsx               # React entry point
└── index.css              # Global styles & design system
```

## 🧹 Optimization

This project has been optimized to include only essential files:
- **Removed 36+ unused UI components** 
- **Clean folder structure** with organized component hierarchy
- **Minimal dependencies** - Only what's actually used
- **Accessibility-first** - Every design decision prioritizes readability

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/42587672-7f76-4f3a-9d59-ae9886e1b122) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/42587672-7f76-4f3a-9d59-ae9886e1b122) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
