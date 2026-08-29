import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { NewStudent, Student } from './types'

const STORAGE_KEY = 'my-school:students'
const SIMULATED_LATENCY_MS = 300

function readStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Student[]) : []
  } catch {
    return []
  }
}

function writeStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const studentsApiSlice = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      async queryFn() {
        await delay(SIMULATED_LATENCY_MS)
        const students = readStudents().sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        )
        return { data: students }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Student' as const, id })),
              { type: 'Student' as const, id: 'LIST' },
            ]
          : [{ type: 'Student' as const, id: 'LIST' }],
    }),
    addStudent: builder.mutation<Student, NewStudent>({
      async queryFn(newStudent) {
        await delay(SIMULATED_LATENCY_MS)

        const trimmedEmail = newStudent.email.trim().toLowerCase()
        const students = readStudents()

        if (students.some((student) => student.email.toLowerCase() === trimmedEmail)) {
          return {
            error: `A student with the email "${newStudent.email}" is already registered.`,
          }
        }

        const student: Student = {
          ...newStudent,
          id: createId(),
          createdAt: new Date().toISOString(),
        }

        writeStudents([...students, student])
        return { data: student }
      },
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),
    deleteStudent: builder.mutation<{ id: string }, string>({
      async queryFn(id) {
        await delay(SIMULATED_LATENCY_MS)
        const students = readStudents()
        writeStudents(students.filter((student) => student.id !== id))
        return { data: { id } }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Student', id }],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useDeleteStudentMutation,
} = studentsApiSlice
