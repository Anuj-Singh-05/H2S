# VolunteerMatch AI 🤝

> A smart resource allocation platform built for the Hack2Skill × Google for Developers — Solution Challenge 2026.

VolunteerMatch AI is a web-based artificial intelligence platform that empowers NGO administrators to seamlessly match available personnel with urgent community needs in real-time. By leveraging Google's Gemini AI, we eliminate the need for manual, spreadsheet-based coordination, replacing it with an explainable, data-driven matching engine.

---

## 🛑 Problem Statement
Local social groups and NGOs collect critical community needs data through paper surveys and field reports. This data is often siloed, scattered, and disconnected. During emergencies (such as flood relief or natural disasters), it becomes nearly impossible to instantly see where help is needed most, or to quickly connect the *right* available volunteers to the most urgent tasks based on skill requirements and geographical proximity.

## 💡 Solution Overview
**VolunteerMatch AI** is a centralized web dashboard that solves this coordination crisis. NGO admins can list "Community Needs" (annotated with urgency, location, and skills) alongside a registry of available volunteers. 

Instead of an admin manually reading hundreds of rows to assign tasks, the system uses the **Google Gemini API** (gemini-1.5-flash) to intelligently reason over unstructured volunteer profiles and community needs. With a single click of "Find AI Match," the engine produces a ranked list of the top 3 best-suited volunteers, accompanied by natural language justifications for *why* they are the perfect fit.

### Key Features
- **Community Needs Board:** Visualize and prioritize alerts by urgency (Critical/Medium/Low).
- **Volunteer Registry:** Maintain a living database of available help, zoned by location and tagged by skills.
- **AI Matching Engine:** Unbiased, instant matching using Gemini AI.
- **Explainable AI:** Gemini provides a human-readable justification for every match it suggests, building trust with NGO workers.
- **Dashboard Analytics:** Live tracking of open needs vs. fulfilled needs.

## 🚀 Technologies Used
- Frontend: **React** (via Vite)
- Styling: **Tailwind CSS**
- AI Integration: **Google Gemini API** (gemini-1.5-flash)
- Icons: **Lucide React**

## 💻 Running the Prototype Locally

To test this prototype locally, follow these steps:

1. Clone this repository.
2. Ensure you have Node.js installed.
3. Run `npm install` to grab the dependencies.
4. Run `npm run dev` to start the frontend server.
5. In the bottom right corner of the dashboard, click the "Sparkles" settings icon to input your **Gemini API Key** before testing the AI matching!

---
*Built with ❤️ for Solution Challenge 2026.*
