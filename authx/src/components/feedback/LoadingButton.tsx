import Spinner from "./Spinner";

export default function LoadingButton({
  loading,
  children,
  ...props
}: {
  loading?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
