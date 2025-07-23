import { redirect } from "next/navigation";

export default function Home() {
  redirect("/courses");
  return null;
}
