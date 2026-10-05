import {loginStyles as s } from "../assets/dummyStyles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from "../shared/AuthContext";
import {useState, useEffect} from "react";

const roleChoices = [
  {value: "user", label: "Student", icon: UserRound},
  {value: "admin", label: "Admin", icon: ShieldCheck}
]
const Login = () => {
  const {login} = useAuth;
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
    useEffect(() => {
    if (location.state?.signupEmail || location.state?.signupPassword) {
      setForm((current) => ({
        ...current,
        email: location.state?.signupEmail ?? "",
        password: location.state?.signupPassword ?? "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }
  // to submit the data to the backend and handle login
  return (
   <div className={s.pageContainer}>
    <div className={s.mainCard}>
      <section className={s.infoPanel}>
        <span className={s.roleBadge}>College role login
          </span>
          <h1 className={s.infoTitle}>Choose student or admin first, then open the correct library panel</h1>
          <p className={s.infoDescription}>Select the role you want to enter, then login with the matching account.</p>
          <div className={s.infoBoxesContainer}>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}><UserRound size={16} />Student Sign In</p>            
              <p className={s.infoBoxText}>Register a new student account using the "Create account" link to test student functionality with real data.</p>
            </div>

             <div className={s.infoBox}>
              <p className={s.infoBoxTitle}><ShieldCheck size={16} />Admin Access</p>            
              <p className={s.infoBoxText}>
                Log in using your registered admin account to access the administrative dashboard and catalog features.
              </p>
            </div>
          </div>
          </section>
          <section className={s.formPanel}>
            <div className={s.formInner}>
              <Link to="/" className={s.backLink}></Link>
              <h2 className={s.formTitle}>Login Account</h2>
              <p className={s.formSubtitle}>Select your role and use your college library account credentials.</p>
            </div>
          </section>
    </div>
   </div>
  )
}

export default Login