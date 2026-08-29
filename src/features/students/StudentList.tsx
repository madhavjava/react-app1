import { useGetStudentsQuery, useDeleteStudentMutation } from './studentsApiSlice'

function formatDate(value: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

function StudentList() {
  const { data: students = [], isLoading, isFetching, isError } = useGetStudentsQuery()
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation()

  if (isLoading) {
    return <p className="student-list-status">Loading students…</p>
  }

  if (isError) {
    return (
      <p className="student-list-status student-form-error">
        Unable to load the student roster.
      </p>
    )
  }

  return (
    <div className="student-list">
      <h2>
        Registered students{' '}
        <span className="student-list-count">({students.length})</span>
      </h2>

      {isFetching && <p className="student-list-status">Refreshing…</p>}

      {students.length === 0 ? (
        <p className="student-list-status">No students registered yet.</p>
      ) : (
        <ul className="student-list-items">
          {students.map((student) => (
            <li key={student.id} className="student-list-item">
              <div className="student-list-item-info">
                <strong>
                  {student.firstName} {student.lastName}
                </strong>
                <span>{student.email}</span>
                <span>
                  {student.grade} · DOB {formatDate(student.dateOfBirth)}
                </span>
                <span>
                  Guardian: {student.guardianName} ({student.guardianPhone})
                </span>
              </div>
              <button
                type="button"
                className="student-remove-btn"
                disabled={isDeleting}
                onClick={() => deleteStudent(student.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentList
