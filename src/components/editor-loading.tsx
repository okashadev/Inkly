import Spinner from "./home/Spinner";

export default function EditorLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
        <Spinner />
        Inkly
      </div>
    </div>
  );
}
