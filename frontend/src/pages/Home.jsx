import Sidebar from "../components/Sidebar";

import { BookMarked, ShieldCheck, Users } from "lucide-react";

import { useAuth } from "../shared/AuthContext";

import { useNavigate } from "react-router-dom";
import { homeStyles as s } from "../assets/dummyStyles";
const navItems = [
  {
    label: "Student Dashboard",
    description: "Open issued books, fines, and profile details",
    href: "/user/dashboard",
    match: "/user",
    icon: "dashboard",
  },
  {
    label: "Admin Dashboard",
    description: "Manage student issues, returns, and fines",
    href: "/admin/dashboard",
    match: "/admin",
    icon: "admin",
  },
];

const features = [
  {
    icon: BookMarked,
    title: "Manual book issuing",
    text: "Track manual book issues, due dates, returns, and dynamic fine calculations in one workflow.",
  },
  {
    icon: Users,
    title: "Student self-service",
    text: "Students can review borrowed books, pending fines, academic details, and recent activity quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Admin desk controls",
    text: "Library staff can manage student records, manual book issues, overdue items, and fine settings from the admin area.",
  },
];

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const footerItems = currentUser
    ? [
        {
          label: "Logout",
          icon: "login",
          kind: "primary",
          action: () => {
            logout();
            navigate("/");
          },
        },
      ]
    : [
        {
          label: "Login",
          href: "/login",
          icon: "login",
          kind: "primary",
        },
        {
          label: "Sign Up",
          href: "/signup",
          icon: "signup",
          kind: "secondary",
        },
      ];

  return (
    <div className={s.layoutContainer}>
      <Sidebar
        title="ShelfWise"
        subtitle="Library management portal"
        badge="Beautiful theme"
        navItems={navItems}
        footerItems={footerItems}
      />
      <main className={s.mainContent}>
        <div className={s.innerContainer}>
          <section className={s.heroSection}>
            <div className={s.heroGrid}>
              <div>
                <span className={s.heroBadge}>Library Management Website</span>
              </div>
              <h1 className={s.heroTitle}>
                Manage students, books, returns, and fines in one library
                dashboard
              </h1>

              <p className={s.heroText}>
                This library management portal gives students a focused
                borrowing dashboard and gives admins a practical workspace for
                manual circulation, user records and overdue tracking.
              </p>
              <div className=""></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
