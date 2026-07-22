import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="font-mono text-md tracking-widest text-amber-400 uppercase">
          Error 404
        </p>

        <h1 className="text-6xl font-bold mt-4">Lost?</h1>

        <p className="text-neutral-400 mt-4 px-5">
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="
            mt-8 px-6 py-3 rounded-xl bg-amber-400 text-neutral-950 font-semibold  hover:bg-amber-300 transition cursor-pointer"
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
