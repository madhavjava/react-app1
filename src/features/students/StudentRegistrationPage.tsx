import StudentRegistrationForm from './StudentRegistrationForm'
import StudentList from './StudentList'
import './students.css'

function StudentRegistrationPage() {
  return (
    <section id="students" className="students-page">
      <StudentRegistrationForm />
      <StudentList />
    </section>
  )
}

export default StudentRegistrationPage
