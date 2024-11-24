interface BadgeProps {
  type: 'gift' | 'new' | 'sale';
  text: string;
}

export default function ProductBadge({ type, text }: BadgeProps) {
  const baseClasses = "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold z-10";
  
  const colors = {
    gift: "bg-purple-500 text-white",
    new: "bg-blue-500 text-white",
    sale: "bg-red-500 text-white"
  };

  return (
    <span className={`${baseClasses} ${colors[type]}`}>
      {text}
    </span>
  );
}

