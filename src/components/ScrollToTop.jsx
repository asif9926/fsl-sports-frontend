import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // যখনই পেজের লিংক (pathname) চেঞ্জ হবে, উইন্ডো একদম উপরে চলে যাবে
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // চাইলে "smooth" কেটে "instant" দিতে পারেন সাথে সাথে যাওয়ার জন্য
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;