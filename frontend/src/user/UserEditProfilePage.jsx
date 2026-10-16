import { useState, useEffect } from "react";
import { useAuth } from "../shared/AuthContext";
import { userEditProfilePageStyles } from "./../assets/dummyStyles";
import { studentSemesters, studentYears } from "./../data/libraryData";

const UserEditProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    stream: "",
    semester: "",
    academicYear: "",
    rollNumber: "",
  });
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setForm({
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      phone: currentUser.phone ?? "",
      department: currentUser.department ?? "",
      stream: currentUser.stream ?? "",
      semester: currentUser.semester ?? "",
      academicYear: currentUser.academicYear ?? "",
      rollNumber: currentUser.rollNumber ?? "",
    });
    setIsEditing(false);
    setError("");
  }, [currentUser]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, [name]: digitsOnly }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  };
  return <div>UserEditProfilePage</div>;
};

export default UserEditProfilePage;
