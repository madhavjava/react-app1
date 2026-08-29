import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAddStudentMutation } from './studentsApiSlice'
import type { NewStudent } from './types'

const initialFormState: NewStudent = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  grade: '',
  guardianName: '',
  guardianPhone: '',
}

const GRADES = [
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
]

function isFormValid(form: NewStudent) {
  return (
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.dateOfBirth.trim() !== '' &&
    form.grade.trim() !== '' &&
    form.guardianName.trim() !== '' &&
    form.guardianPhone.trim() !== ''
  )
}

function StudentRegistrationForm() {
  const [form, setForm] = useState<NewStudent>(initialFormState)
  const [addStudent, { isLoading, error, isSuccess }] = useAddStudentMutation()

  function handleChange(field: keyof NewStudent) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isFormValid(form)) return

    try {
      await addStudent(form).unwrap()
      setForm(initialFormState)
    } catch {
      // error state is surfaced via the `error` value from the mutation hook
    }
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <h2>Student Registration</h2>

      <div className="student-form-grid">
        <label>
          First name
          <input
            type="text"
            value={form.firstName}
            onChange={handleChange('firstName')}
            required
          />
        </label>

        <label>
          Last name
          <input
            type="text"
            value={form.lastName}
            onChange={handleChange('lastName')}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
          />
        </label>

        <label>
          Date of birth
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
            required
          />
        </label>

        <label>
          Grade
          <select value={form.grade} onChange={handleChange('grade')} required>
            <option value="" disabled>
              Select grade
            </option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </label>

        <label>
          Guardian name
          <input
            type="text"
            value={form.guardianName}
            onChange={handleChange('guardianName')}
            required
          />
        </label>

        <label>
          Guardian phone
          <input
            type="tel"
            value={form.guardianPhone}
            onChange={handleChange('guardianPhone')}
            required
          />
        </label>
      </div>

      {error && (
        <p className="student-form-error" role="alert">
          {typeof error === 'string'
            ? error
            : 'message' in error && error.message
              ? error.message
              : 'Something went wrong. Please try again.'}
        </p>
      )}

      {isSuccess && !isLoading && (
        <p className="student-form-success" role="status">
          Student registered successfully.
        </p>
      )}

      <button type="submit" className="counter" disabled={isLoading || !isFormValid(form)}>
        {isLoading ? 'Registering…' : 'Register student'}
      </button>
    </form>
  )
}

export default StudentRegistrationForm
