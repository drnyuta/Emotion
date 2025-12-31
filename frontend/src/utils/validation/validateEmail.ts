export const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      return "Email is required.";
    }

    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };