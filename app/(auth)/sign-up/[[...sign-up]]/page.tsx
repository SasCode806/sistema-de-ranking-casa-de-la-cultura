import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      path="/sign-up"
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
          headerTitle: "text-lg font-bold mb-4",
          headerSubtitle: "text-sm text-gray-500",
          footer: "hidden",
        },
        variables: {
          colorPrimary: "#0070f3",
          fontFamily: "'Inter', sans-serif",
        },
      }}
    />
  );
}
