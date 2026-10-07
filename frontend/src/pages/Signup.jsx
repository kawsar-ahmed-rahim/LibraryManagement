import { useEffect, useState } from "react";
import { signupStyles as s } from "../assets/dummyStyles";
import { useNavigate } from "react-router-dom";

const stepList = [
  { id: 1, title: "Account" },
  { id: 2, title: "OTP" },
  { id: 3, title: "Profile" },
];

const signupHighlights = [
  "Step 1 collects student account details and checks immediately if the email already exists.",
  "Step 2 verifies the OTP before moving forward.",
  "Step 3 saves department, stream, semester, year, and roll number.",
];

const demoOtp = "2468";


  

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
    const {name, value} = event.target;
    setError("");
    if(name === "phone"){
        const digitOnly = value.replace(/\D/g, "").slice(0, 10);
        setForm((current) => ({
            ...current, [name]: value,
        }))
    }
  }
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
        "Please complete department, stream, semester, year, and roll number."
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
        setError("Please enter the 6-digit OTP code sent to your email.");
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
    setError("");
    if(!validateStepOne() || !form.otp.trim() || !validateStepThree()){
        setError("Please complete all steps first");
        return;
    }
    setLoading(true);
    const result = await completeProfileDate({
        email: form.email,
        department: form.department,
        stream: form.stream,
        semester: form.semester,
        academicYear: form.academicYear,
        rollNumber: form.rollNumber
    });
    setLoading(false);
    if(!result.ok){
        showToast(result.error, "error");
        setError(result.error);
        return;
    }
    showToast("student profile completed. Redirecting to login...");
    setTimeout(() => {
        logout();
        navigate("/login", { replace: true , state: { signupEmail: form.email, signupPassword: form.password }});
    },1000);
  }
  return (
    <div>

    </div>
  )
}

export default Signup