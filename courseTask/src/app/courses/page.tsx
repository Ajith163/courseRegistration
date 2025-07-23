"use client";
import { useState } from "react";
import CourseTable from "@/components/CourseTable";
import SearchBar from "@/components/SearchBar";
import courses from "@/data/courses.json";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Courses</h1>
      <SearchBar value={search} onChange={setSearch} />
      <CourseTable search={search} courses={courses} />
    </div>
  );
}
