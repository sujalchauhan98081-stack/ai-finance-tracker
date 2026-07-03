const Skeleton = ({ width = "w-full", height = "h-4", className = "" }) => {
  return (
    <div
      className={`${width} ${height} ${className} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
    />
  );
};

export default Skeleton;