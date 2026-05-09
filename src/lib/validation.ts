export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
export const MOBILE_RE = /^[0-9]{7,15}$/;

export type SignupValues = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  mobile: string;
};

export type SignupErrors = Partial<Record<keyof SignupValues, string>>;

export function validateSignup(v: SignupValues): SignupErrors {
  const e: SignupErrors = {};
  if (!v.fullname.trim()) e.fullname = "Full name is required.";
  else if (v.fullname.trim().length < 2) e.fullname = "Name is too short.";

  if (!v.email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email.";

  if (!v.password) e.password = "Password is required.";
  else if (!PASSWORD_RE.test(v.password))
    e.password =
      "Min 8 chars, with 1 uppercase, 1 lowercase, and 1 special character.";

  if (!v.confirmPassword) e.confirmPassword = "Please confirm your password.";
  else if (v.password !== v.confirmPassword)
    e.confirmPassword = "Passwords don't match.";

  if (!v.gender) e.gender = "Please select a gender.";

  if (!v.mobile.trim()) e.mobile = "Mobile is required.";
  else if (!MOBILE_RE.test(v.mobile.trim()))
    e.mobile = "Enter a valid mobile number.";

  return e;
}

export type LoginValues = { email: string; password: string };
export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export function validateLogin(v: LoginValues): LoginErrors {
  const e: LoginErrors = {};
  if (!v.email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email.";
  if (!v.password) e.password = "Password is required.";
  return e;
}

export type ProductFormValues = {
  title: string;
  price: string;
  category: string;
  description: string;
  thumbnail: string;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export function validateProductForm(v: ProductFormValues): ProductFormErrors {
  const e: ProductFormErrors = {};
  if (!v.title.trim()) e.title = "Title is required.";
  if (!v.price.trim()) e.price = "Price is required.";
  else if (Number.isNaN(Number(v.price)) || Number(v.price) < 0)
    e.price = "Enter a valid price.";
  if (!v.description.trim()) e.description = "Description is required.";
  return e;
}

export function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (pw.length >= 8) score = (score + 1) as 1;
  if (/[A-Z]/.test(pw)) score = (score + 1) as 2;
  if (/[a-z]/.test(pw)) score = (score + 1) as 3;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw)) score = (score + 1) as 4;
  return score;
}
