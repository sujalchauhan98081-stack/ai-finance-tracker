const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
      © {new Date().getFullYear()} Finance Tracker Platform  — Built with MERN + Groq
    </footer>
  );
};

export default Footer;