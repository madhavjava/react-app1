export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  grade: string
  guardianName: string
  guardianPhone: string
  createdAt: string
}

export type NewStudent = Omit<Student, 'id' | 'createdAt'>
