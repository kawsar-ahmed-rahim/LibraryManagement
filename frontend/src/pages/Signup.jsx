import { useEffect, useState } from "react";
import { useAuth } from "../shared/AuthContext";
import { signupStyles as s } from "../assets/dummyStyles";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  UserRound,
  Phone,
  LockKeyhole,
  Mail,
  EyeOff,
  Eye,
  Building2,
  GraduationCap,
  CalendarDays,
  Hash,
} from "lucide-react";

const stepList = [
  { id: 1, title: "Account" },
  { id: 2, title: "OTP" },
  { id: 3, title: "Profile" },
];

const semesterOptions = Array.from(
  { length: 8 },
  (_, i) => `Semester ${i + 1}`,
);
const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// Button classes. If your signupStyles has button keys, swap these in.
const primaryBtn =
  "flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryBtn =
  "rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60";

const Signup = () => {
  const { registerStudent, verifyOtpCode, completeProfileData, logout } =
    useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    role: "user",
    department: "",
    stream: "",
    semester: "Semester 1",
    academicYear: "1st Year",
    rollNumber: "",
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  // it will show the toast for 2.6 second

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");

    let nextValue = value;
    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "otp") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const validateStepOne = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim()
    ) {
      setError("Please fill name, email, mobile number, and password first.");
      return false;
    }
    if (form.phone.trim().replace(/\D/g, "").length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const validateStepThree = () => {
    if (
      !form.department.trim() ||
      !form.stream.trim() ||
      !form.semester.trim() ||
      !form.academicYear.trim() ||
      !form.rollNumber.trim()
    ) {
      setError(
        "Please complete department, stream, semester, year, and roll number.",
      );
      return false;
    }
    return true;
  };

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
  };

  const goNext = async () => {
    setError("");

    if (step === 1) {
      if (!validateStepOne()) return;
      setLoading(true);
      const res = await registerStudent({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setLoading(false);
      if (!res.ok) {
        showToast(res.error, "error");
        setError(res.error);
        return;
      }
      showToast("OTP sent to your email successfully!");
    }

    if (step === 2) {
      if (!form.otp.trim()) {
        setError("Please enter the 4-digit OTP code sent to your email.");
        return;
      }
      setLoading(true);
      const res = await verifyOtpCode({
        email: form.email,
        otp: form.otp,
      });
      setLoading(false);
      if (!res.ok) {
        showToast(res.error, "error");
        setError(res.error);
        return;
      }
      showToast("OTP verified successfully!");
    }

    setStep((current) => Math.min(3, current + 1));
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };

  // to submit the data and get user registered in the server
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Enter key on steps 1 and 2 should move forward, not submit everything
    if (step < 3) {
      goNext();
      return;
    }

    setError("");
    if (!validateStepOne() || !form.otp.trim() || !validateStepThree()) {
      setError("Please complete all steps first");
      return;
    }
    setLoading(true);
    const result = await completeProfileData({
      email: form.email,
      department: form.department,
      stream: form.stream,
      semester: form.semester,
      academicYear: form.academicYear,
      rollNumber: form.rollNumber,
    });
    setLoading(false);
    if (!result.ok) {
      showToast(result.error, "error");
      setError(result.error);
      return;
    }
    showToast("Student profile completed. Redirecting to login...");
    setTimeout(() => {
      logout();
      navigate("/login", {
        replace: true,
        state: { signupEmail: form.email, signupPassword: form.password },
      });
    }, 1000);
  };

  return (
    <div className={s.pageContainer}>
      {toast && (
        <div
          className={`${s.toastBase} ${toast.tone === "error" ? s.toastError : s.toastSuccess}`}
        >
          <div className={s.toastContent}>
            <CheckCircle2 size={18} />
            {toast.message}
          </div>
        </div>
      )}
      <div className={s.mainCard}>
        <section className={s.formPanel}>
          <div className={s.formInner}>
            <Link to="/" className={s.backLink}>
              Back to Home
            </Link>
            <h1 className={s.panelTitle}>
              Create your student library account.
            </h1>
            <p className={s.panelSubtitle}>
              Complete the student signup steps: account, OTP, and profile
              details.
            </p>
            <div className={s.stepGrid}>
              {stepList.map((item) => (
                <div
                  key={item.id}
                  className={`${s.stepCard} ${step >= item.id ? s.stepCardCompleted : s.stepCardPending}`}
                >
                  <p className={s.stepLabel}>Step {item.id}</p>
                  <p className={s.stepTitle}>{item.title}</p>
                </div>
              ))}
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
              {/* STEP 1: Account */}
              {step === 1 && (
                <>
                  <label className="block">
                    <span className={s.fieldLabel}>
                      <UserRound size={15} />
                      Full name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter Your Full Name"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Mail size={15} />
                      Email Address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Phone size={15} />
                      Phone Number
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter Your Phone Number"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <LockKeyhole size={15} />
                      Password
                    </span>
                    <div className={s.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                        className={s.passwordInput}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className={s.toggleButton}
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </label>
                </>
              )}

              {/* STEP 2: OTP */}
              {step === 2 && (
                <label className="block">
                  <span className={s.fieldLabel}>
                    <LockKeyhole size={15} />
                    OTP Code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    className={s.input}
                  />
                </label>
              )}

              {/* STEP 3: Profile */}
              {step === 3 && (
                <>
                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Building2 size={15} />
                      Department
                    </span>
                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <GraduationCap size={15} />
                      Stream
                    </span>
                    <input
                      type="text"
                      name="stream"
                      value={form.stream}
                      onChange={handleChange}
                      placeholder="Enter Your Stream"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <CalendarDays size={15} />
                      Semester
                    </span>
                    <select
                      name="semester"
                      value={form.semester}
                      onChange={handleChange}
                      className={s.input}
                    >
                      {semesterOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <CalendarDays size={15} />
                      Academic Year
                    </span>
                    <select
                      name="academicYear"
                      value={form.academicYear}
                      onChange={handleChange}
                      className={s.input}
                    >
                      {yearOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Hash size={15} />
                      Roll Number
                    </span>
                    <input
                      type="text"
                      name="rollNumber"
                      value={form.rollNumber}
                      onChange={handleChange}
                      placeholder="Enter Your Roll Number"
                      className={s.input}
                    />
                  </label>
                </>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className={secondaryBtn}
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={loading}
                    className={primaryBtn}
                  >
                    {loading
                      ? step === 1
                        ? "Sending OTP..."
                        : "Verifying..."
                      : step === 1
                        ? "Send OTP"
                        : "Verify OTP"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={primaryBtn}
                  >
                    {loading ? "Saving..." : "Complete Signup"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signup;