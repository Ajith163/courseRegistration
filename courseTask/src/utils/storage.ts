const STORAGE_KEY = "registeredCourses";

export function getRegisteredCourses(): number[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function registerCourse(id: number) {
  const current = getRegisteredCourses();
  if (!current.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  }
}

export function unregisterCourse(id: number) {
  const current = getRegisteredCourses();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(current.filter((cid) => cid !== id))
  );
}

export function isCourseRegistered(id: number): boolean {
  return getRegisteredCourses().includes(id);
}
