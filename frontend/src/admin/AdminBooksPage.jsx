import {adminBooksPageStyles as s} from "../assets/dummyStyles";


const AdminBooksPage = () => {
  return (
    <div className={s.pageContainer}>
      <section className={s.mainSection}>
        <div className={s.innerContainer}>
          <div className={s.headerFlex}>
            <div>
              <h2 className={s.title}>Issue Book To Student</h2>
              <p className={s.subtitle}>Select a student, add manual book entries with book code, and the active overdue fine rule will be used automatically after the due date.</p>
            </div>
            <div className={s.fineRuleBadge}></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminBooksPage