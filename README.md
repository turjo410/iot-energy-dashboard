# ⚡️ EnergyIQ: IoT Based Real-Time Energy Monitoring

<p align="center">
  <img src="[https://i.imgur.com/8f1764.png](https://i.imgur.com/Yw3KF8S.png)" alt="EnergyIQ Dashboard Screenshot" width="800"/>
</p>

<p align="center">
  A sophisticated, real-time energy monitoring dashboard built with Next.js, TypeScript, and Framer Motion. This project, developed for the CSE407 Green Computing course, transforms raw energy consumption data into a dynamic, interactive, and insightful web application.
</p>

<p align="center">
  <a href="https://turjo410.github.io/iot-energy-dashboard/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-blue.svg?style=for-the-badge&logo=githubpages" />
  </a>
</p>

---

## 📋 Project Submission Details

| Field                  | Details                               |
| ---------------------- | ------------------------------------- |
| **Student Name** | Shahriar Khan                         |
| **Student ID** | 2022-3-60-016                         |
| **Course** | CSE407 - Green Computing              |
| **Course Instructor** | Rashedul Amin Tuhin (RDA)             |

---

## ✨ Core Features

This dashboard is a fully-featured application that fulfills all the requirements of the course project manual, including:

* **🎬 Animated Storytelling Introduction:** A visually captivating, scroll-driven introduction page that presents the project's context, hardware, and objectives in a style inspired by premium product websites.
* **📊 Comprehensive Dashboard:** At-a-glance view of the most critical energy metrics, including live wattage and current gauges, total consumption, cumulative cost, peak power, and average power factor.
* **🧠 Advanced Analytics:** A dedicated analytics page that provides deeper insights into the data, featuring:
    * Compressor On/Off cycle visualization.
    * 24-hour duty cycle analysis.
    * Power type distribution (Active, Reactive, Apparent).
    * Current vs. Active Power correlation scatter plot.
* **💰 Detailed Cost Analysis:** A financial breakdown page showing cumulative costs, average cost per kWh, and a visual representation of the official Bangladesh tariff structure. It also includes a section for Return on Investment (ROI) analysis.
* **🕹️ Interactive Device Control:** A functional device management page that simulates On/Off control for connected appliances, with the refrigerator's status linked to the live data.
* **📈 Strategic Reports:** A dedicated report page presenting a full SWOT and PESTLE analysis in a visually appealing, interactive format.
* **🖼️ Interactive Media Gallery:** An animated gallery showcasing project videos and images with a full-screen, click-to-enlarge modal.

---

## 🛠️ Technology Stack

This project is built with a modern, powerful, and scalable tech stack:

| Technology | Description |
| :--- | :--- |
| **Next.js** | A React framework for building fast, server-rendered applications. |
| **React** | A JavaScript library for building user interfaces. |
| **TypeScript** | For static type-checking, ensuring code quality and robustness. |
| **Tailwind CSS** | A utility-first CSS framework for rapid, custom UI development. |
| **Framer Motion** | For creating fluid, complex animations and interactions. |
| **Recharts** | A composable charting library for building beautiful data visualizations. |
| **PapaParse** | A fast and reliable in-browser CSV parser. |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/iot-energy-dashboard.git](https://github.com/your-username/iot-energy-dashboard.git)
    cd iot-energy-dashboard
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Add your data:**
    * Place your `data.csv` file inside the `/public` directory at the root of the project.
    * Place your gallery images and videos inside the `/public/gallery` directory.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🌐 Deployment

This application is configured for seamless deployment on **GitHub Pages**.

> **Note:** The `next.config.js` file is pre-configured with the `basePath` and `assetPrefix` for a repository named `iot-energy-dashboard`. If your repository has a different name, you must update these values in the config file before deploying.

The deployment is handled automatically by a GitHub Actions workflow (`nextjs.yml`) every time a new commit is pushed to the `main` branch.
